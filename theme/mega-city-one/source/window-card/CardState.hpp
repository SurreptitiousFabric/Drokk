#pragma once

namespace Drokk {

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
