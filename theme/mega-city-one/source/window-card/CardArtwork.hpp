#pragma once

#include <array>
#include <string>
#include <cairo.h>
#include <pango/pangocairo.h>

namespace Drokk {

struct CardPaint {
    std::string background, outline, heading, text, tab, panelFont, headingFont;
};

// The shared mockup's 204px body includes a 10px raised upper-right corner.
inline constexpr int CARD_WIDTH = 218;
inline constexpr int CARD_HEIGHT = 132;

inline void paintColour(cairo_t* cr, const std::string& hex) {
    const auto rgb = std::stoul(hex.substr(1), nullptr, 16);
    cairo_set_source_rgb(cr, ((rgb >> 16) & 255) / 255.0, ((rgb >> 8) & 255) / 255.0, (rgb & 255) / 255.0);
}

inline void cardText(cairo_t* cr, const std::string& text, const std::string& family,
                     double x, double y, double size, double width, bool heading) {
    auto* layout = pango_cairo_create_layout(cr);
    auto* font = pango_font_description_new();
    pango_font_description_set_family(font, family.c_str());
    pango_font_description_set_absolute_size(font, size * PANGO_SCALE);
    pango_font_description_set_weight(font, heading ? PANGO_WEIGHT_BOLD : PANGO_WEIGHT_NORMAL);
    pango_font_description_set_style(font, heading ? PANGO_STYLE_OBLIQUE : PANGO_STYLE_NORMAL);
    pango_layout_set_font_description(layout, font);
    pango_layout_set_text(layout, text.c_str(), static_cast<int>(text.size()));
    pango_layout_set_width(layout, static_cast<int>(width * PANGO_SCALE));
    pango_layout_set_ellipsize(layout, PANGO_ELLIPSIZE_END);
    pango_layout_set_single_paragraph_mode(layout, true);
    cairo_move_to(cr, x, y);
    pango_cairo_show_layout(cr, layout);
    pango_font_description_free(font);
    g_object_unref(layout);
}

inline void paintTab(cairo_t* cr, const CardPaint& paint, bool open) {
    cairo_save(cr);
    cairo_translate(cr, 1, 11);
    cairo_move_to(cr, 204, 43);
    cairo_line_to(cr, 216, 34);
    cairo_line_to(cr, 216, 76);
    cairo_line_to(cr, 204, 67);
    cairo_close_path(cr);
    paintColour(cr, paint.tab);
    cairo_fill(cr);
    paintColour(cr, paint.background);
    cardText(cr, open ? "›" : "‹", paint.panelFont, 207, 45, 17, 10, false);
    cairo_restore(cr);
}

inline void paintCard(cairo_t* cr, const CardPaint& paint, const std::string& heading,
                      const std::array<std::string, 3>& rows, bool open) {
    cairo_save(cr);
    cairo_translate(cr, 1, 11);
    if (open) {
        cairo_move_to(cr, 0, 14);
        cairo_line_to(cr, 14, 0);
        cairo_line_to(cr, 160, 0);
        cairo_line_to(cr, 170, -10);
        cairo_line_to(cr, 204, -10);
        cairo_line_to(cr, 204, 107);
        cairo_line_to(cr, 191, 120);
        cairo_line_to(cr, 14, 120);
        cairo_line_to(cr, 0, 106);
        cairo_close_path(cr);
        paintColour(cr, paint.background);
        cairo_fill_preserve(cr);
        paintColour(cr, paint.outline);
        cairo_set_line_width(cr, 2);
        cairo_stroke(cr);
        paintColour(cr, paint.heading);
        cardText(cr, heading, paint.headingFont, 14, 7, 23, 176, true);
        cairo_set_line_width(cr, 1);
        cairo_move_to(cr, 14, 38);
        cairo_line_to(cr, 192, 38);
        cairo_stroke(cr);
        paintColour(cr, paint.text);
        for (size_t i = 0; i < rows.size(); ++i)
            cardText(cr, rows[i], paint.panelFont, 14, 47 + i * 22, 15, 176, false);
    }
    cairo_restore(cr);
    paintTab(cr, paint, open);
}

}
