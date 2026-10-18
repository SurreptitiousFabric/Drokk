#include "Compatibility.hpp"
#include <hyprland/src/plugins/PluginAPI.hpp>
#include <hyprland/src/config/ConfigValue.hpp>
#include <hyprland/src/config/values/types/BoolValue.hpp>
#include <hyprutils/animation/BezierCurve.hpp>
#include <hyprland/src/desktop/state/WindowState.hpp>
#include <hyprland/src/desktop/state/FocusState.hpp>
#include <hyprland/src/desktop/view/Window.hpp>
#include <hyprland/src/event/EventBus.hpp>
#include <hyprland/src/managers/fullscreen/FullscreenController.hpp>
#include <hyprland/src/output/Monitor.hpp>
#include <hyprland/src/render/Renderer.hpp>
#include <hyprland/src/render/pass/TexPassElement.hpp>
#include <linux/input-event-codes.h>
#include <algorithm>
#include <cmath>
#include <cctype>
#include <chrono>
#include <vector>
#include "CardArtwork.hpp"
#include "CardState.hpp"
#include "CardTheme.hpp"

namespace {
HANDLE pluginHandle;
CHyprSignalListener opened, closed, moved, released, reloaded;
SP<Config::Values::CBoolValue> enabled;
bool tabButtonHeld = false;
bool tabButtonReleased = false;
Hyprutils::Animation::CBezierCurve slideCurve;

class WindowCard final : public IHyprWindowDecoration {
  public:
    explicit WindowCard(PHLWINDOW owner) : IHyprWindowDecoration(owner), window(owner) {}

    SDecorationPositioningInfo getPositioningInfo() override {
        return {.policy = DECORATION_POSITION_STICKY, .edges = DECORATION_EDGE_RIGHT,
                .priority = 10000, .desiredExtents = {{0, 0}, {10, 0}}, .reserved = true};
    }
    void onPositioningReply(const SDecorationPositioningReply&) override { damageEntire(); }
    eDecorationType getDecorationType() override { return DECORATION_CUSTOM; }
    eDecorationLayer getDecorationLayer() override { return DECORATION_LAYER_OVER; }
    uint64_t getDecorationFlags() override { return DECORATION_ALLOWS_MOUSE_INPUT | DECORATION_NON_SOLID; }
    std::string getDisplayName() override { return "Drokk window card"; }
    void updateWindow(PHLWINDOW) override { damageEntire(); }

    void toggle() {
        slideFrom = openness();
        state.open = !state.open;
        slideStarted = std::chrono::steady_clock::now();
        damageEntire();
    }

    void damageEntire() override {
        if (!window) return;
        g_pHyprRenderer->damageBox(lastBox);
        syncGeometry();
        g_pHyprRenderer->damageBox(box());
    }

    void draw(PHLMONITOR monitor, float const& alpha) override {
        if (!shown()) return;
        syncGeometry();
        if (!state.visible()) return;
        const auto owner = window.lock();
        const bool focused = Desktop::focusState()->window() == owner;
        std::string heading = owner->m_class;
        if (heading == "foot" || heading == "Alacritty" || heading == "com.mitchellh.ghostty" || heading == "kitty") heading = "TERMINAL";
        else if (heading == "org.gnome.Nautilus") heading = "FILES";
        else std::transform(heading.begin(), heading.end(), heading.begin(), [](unsigned char c) { return c < 128 ? std::toupper(c) : c; });
        if (heading.empty()) heading = "WINDOW";
        std::vector<Drokk::WorkspaceLabel> occupied;
        for (const auto& candidate : Desktop::windowState()->windows())
            if (candidate->m_isMapped && candidate->m_workspace)
                occupied.push_back({candidate->m_workspace->m_id, candidate->m_workspace->m_name});
        const auto space = Drokk::workspaceRow(owner->m_workspace ? owner->m_workspace->m_id : 0,
            owner->m_workspace ? owner->m_workspace->m_name : "—", std::move(occupied));
        const std::array<std::string, 3> rows = {"TITLE   " + owner->m_title,
            space, focused ? "STATUS  Active" : "STATUS  Inactive"};
        const double scale = monitor->m_scale;
        if (!texture || lastHeading != heading || lastRows != rows || lastScale != scale) {
            lastHeading = heading;
            lastRows = rows;
            texture = makeTexture(scale, false);
        }
        if (!tabTexture || lastOpen != state.open || lastScale != scale) {
            tabTexture = makeTexture(scale, true);
            lastOpen = state.open;
        }
        lastScale = scale;
        lastBox = box();
        auto target = lastBox;
        target.translate(-monitor->m_position).scale(scale).round();
        const float reveal = openness();
        if (reveal > 0) {
            auto clip = lastBox;
            clip.w = 205;
            clip.translate(-monitor->m_position).scale(scale).round();
            CTexPassElement::SRenderData body;
            body.tex = texture;
            body.box = target;
            body.box.x += 205 * scale * (1 - reveal);
            body.clipBox = clip;
            body.a = alpha;
            g_pHyprRenderer->addPassElement(makeUnique<CTexPassElement>(body));
        }
        CTexPassElement::SRenderData render;
        render.tex = tabTexture;
        render.box = target;
        render.a = alpha;
        g_pHyprRenderer->addPassElement(makeUnique<CTexPassElement>(render));
        if (reveal != float(state.open)) g_pHyprRenderer->damageBox(lastBox);
    }

    bool onInputOnDeco(eInputType type, const Vector2D& position, std::any data) override {
        if (type != INPUT_TYPE_BUTTON || !shown()) return false;
        const auto event = std::any_cast<IPointer::SButtonEvent>(data);
        if (event.button != BTN_LEFT) return false;
        if (event.state == WL_POINTER_BUTTON_STATE_RELEASED) return tabButtonReleased;
        syncGeometry();
        if (!state.tabContains(position.x, position.y)) return false;
        toggle();
        tabButtonHeld = true;
        return true;
    }

  private:
    PHLWINDOWREF window;
    Drokk::CardState state;
    SP<Render::ITexture> texture;
    SP<Render::ITexture> tabTexture;
    std::string lastHeading;
    std::array<std::string, 3> lastRows;
    bool lastOpen = true;
    double lastScale = 0;
    CBox lastBox;
    float slideFrom = 1;
    std::chrono::steady_clock::time_point slideStarted{};

    float openness() const {
        static auto animations = CConfigValue<Config::BOOL>("animations:enabled");
        const float elapsed = std::chrono::duration<float, std::milli>(std::chrono::steady_clock::now() - slideStarted).count();
        if (!*animations || elapsed >= 160) return float(state.open);
        return slideFrom + (float(state.open) - slideFrom) * slideCurve.getYForPoint(std::max(0.F, elapsed / 160));
    }
    SP<Render::ITexture> makeTexture(double scale, bool tabOnly) {
        auto* surface = cairo_image_surface_create(CAIRO_FORMAT_ARGB32, std::ceil(Drokk::CARD_WIDTH * scale), std::ceil(Drokk::CARD_HEIGHT * scale));
        auto* cr = cairo_create(surface);
        cairo_scale(cr, scale, scale);
        if (tabOnly) Drokk::paintTab(cr, Drokk::CARD_PAINT, state.open);
        else Drokk::paintCard(cr, Drokk::CARD_PAINT, lastHeading, lastRows, true);
        cairo_destroy(cr);
        cairo_surface_flush(surface);
        auto result = g_pHyprRenderer->createTexture(surface);
        cairo_surface_destroy(surface);
        return result;
    }

    bool shown() const {
        return window && window->visible() && !window->isHidden() &&
            !Fullscreen::controller()->isFullscreen(window.lock(), Fullscreen::FSMODE_FULLSCREEN);
    }
    void syncGeometry() {
        const auto owner = window.lock();
        auto position = owner->position(Desktop::View::IGeometric::GEOMETRIC_CURRENT) + owner->m_floatingOffset;
        if (owner->m_workspace && !owner->m_pinned) position += owner->m_workspace->m_renderOffset->value();
        const auto size = owner->size(Desktop::View::IGeometric::GEOMETRIC_CURRENT);
        state.owner = {position.x, position.y, size.x, size.y};
    }
    CBox box() const { const auto b = state.bounds(); return {b.x, b.y, b.width, b.height}; }
};

void damageCards() {
    for (const auto& window : Desktop::windowState()->windows())
        for (const auto& decoration : window->m_windowDecorations)
            if (auto* card = dynamic_cast<WindowCard*>(decoration.get())) card->damageEntire();
}

void attach(PHLWINDOW window) {
    if (!enabled->value() || !window || !window->m_isMapped) return;
    for (const auto& decoration : window->m_windowDecorations)
        if (dynamic_cast<WindowCard*>(decoration.get())) return;
    HyprlandAPI::addWindowDecoration(pluginHandle, window, makeUnique<WindowCard>(window));
}

void applyEnabled() {
    for (const auto& window : Desktop::windowState()->windows()) {
        if (enabled->value()) { attach(window); continue; }
        std::vector<IHyprWindowDecoration*> cards;
        for (const auto& decoration : window->m_windowDecorations)
            if (dynamic_cast<WindowCard*>(decoration.get())) cards.push_back(decoration.get());
        for (auto* card : cards) HyprlandAPI::removeWindowDecoration(pluginHandle, card);
    }
    if (!enabled->value()) { tabButtonHeld = false; tabButtonReleased = false; }
}
}

APICALL EXPORT std::string PLUGIN_API_VERSION() { return HYPRLAND_API_VERSION; }

APICALL EXPORT PLUGIN_DESCRIPTION_INFO PLUGIN_INIT(HANDLE handle) {
    if (std::string(__hyprland_api_get_hash()) != __hyprland_api_get_client_hash())
        throw std::runtime_error("Drokk window card: rebuild against this Hyprland version before loading");
    pluginHandle = handle;
    enabled = makeShared<Config::Values::CBoolValue>("plugin:drokk_card:enabled", "Show Drokk window cards", false);
    if (!HyprlandAPI::addConfigValueV2(handle, enabled))
        throw std::runtime_error("Drokk window card: could not register enabled setting");
    slideCurve.setup({Vector2D{.2, 0.0}, Vector2D{0.0, 1.0}});
    if (!HyprlandAPI::addLuaFunction(handle, "drokk_card", "toggle", [](lua_State*) {
        const auto focused = Desktop::focusState()->window();
        if (focused) for (const auto& decoration : focused->m_windowDecorations)
            if (auto* card = dynamic_cast<WindowCard*>(decoration.get())) { card->toggle(); break; }
        return 0;
    })) throw std::runtime_error("Drokk window card: could not register toggle action");
    opened = Event::bus()->m_events.window.open.listen([](PHLWINDOW window) { attach(window); damageCards(); });
    closed = Event::bus()->m_events.window.close.listen([](PHLWINDOW) { damageCards(); });
    moved = Event::bus()->m_events.window.moveToWorkspace.listen([](PHLWINDOW, PHLWORKSPACE) { damageCards(); });
    reloaded = Event::bus()->m_events.config.reloaded.listen([] { applyEnabled(); });
    // Let Hyprland update held-button state before the decoration handles release.
    released = Event::bus()->m_events.input.mouse.button.listen([](IPointer::SButtonEvent event, Event::SCallbackInfo&) {
        if (event.button == BTN_LEFT && event.state == WL_POINTER_BUTTON_STATE_RELEASED) {
            tabButtonReleased = tabButtonHeld;
            tabButtonHeld = false;
        }
    });
    HyprlandAPI::reloadConfig();
    return {"drokk-window-card", "Attached, tuckable Drokk window cards", "Drokk", "1.0"};
}

APICALL EXPORT void PLUGIN_EXIT() {
    opened.reset();
    closed.reset();
    moved.reset();
    released.reset();
    reloaded.reset();
    enabled.reset();
    tabButtonHeld = false;
    tabButtonReleased = false;
    // Hyprland owns and removes this plugin's decorations before dlclose.
}
