#pragma once
#include <algorithm>
#include <cstdint>
#include <string>
#include <vector>

namespace Drokk {

struct WorkspaceLabel { int64_t id; std::string name; };
inline std::string workspaceLabel(int64_t id, const std::string& name) {
    return id == 10 && name == "10" ? "0" : name;
}
inline std::string workspaceRow(int64_t currentId, const std::string& current, std::vector<WorkspaceLabel> occupied) {
    std::sort(occupied.begin(), occupied.end(), [](const auto& a, const auto& b) { return a.id < b.id; });
    occupied.erase(std::unique(occupied.begin(), occupied.end(), [](const auto& a, const auto& b) { return a.id == b.id; }), occupied.end());
    std::string others;
    for (const auto& workspace : occupied) {
        if (workspace.id <= 0 || workspace.id == currentId) continue;
        if (!others.empty()) others += ", ";
        others += workspaceLabel(workspace.id, workspace.name);
    }
    return "SPACE   " + workspaceLabel(currentId, current) + (others.empty() ? "" : " (" + others + ")");
}

struct CardBox { double x, y, width, height; };

class CardState {
  public:
    CardBox owner{};
    bool open = true;

    bool visible() const { return owner.width >= 240 && owner.height >= 180; }
    CardBox bounds() const { return {owner.x + owner.width - 208, owner.y + owner.height - 144, 218, 132}; }

    bool tabContains(double x, double y) const {
        if (!visible()) return false;
        const auto box = bounds();
        const double dx = x - box.x - 205;
        const double dy = y - box.y;
        return dx >= 0 && dx <= 12 && dy >= 54 - 0.75 * dx && dy <= 78 + 0.75 * dx;
    }
};

}
