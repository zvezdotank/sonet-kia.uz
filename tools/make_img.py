#!/usr/bin/env python3
"""Пережимает исходники из img/src в webp+jpg (и png для выреза) под нужные ширины.

Запуск: python3 tools/make_img.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "img", "_src")
OUT = os.path.join(ROOT, "img")

# имя → (файл исходника, ширины, есть ли прозрачность)
JOBS = {
    "car-white":  ("pasted-1787529322652-0.png", (740, 1480), True),
    "car-red":    ("pasted-1787529291951-0.png", (740, 1480), False),
    "car-black":  ("pasted-1787529216560-0.png", (740, 1480), False),
    "car-grey":   ("pasted-1787529280859-0.png", (740, 1480), False),
    "car-silver": ("pasted-1787529186431-0.png", (740, 1200), False),
    "drive":      ("pasted-1787529162945-0.png", (570, 1060), False),
    "interior":   ("pasted-1787529204075-0.png", (400, 770, 1540), False),
    "optics":     ("pasted-1787529104999-0.png", (400, 770, 1200), False),
    "profile":    ("pasted-1787529174761-0.png", (400, 770, 900), False),
}


def save(im, path, alpha):
    if alpha:
        im.save(path + ".webp", quality=86, method=6)
        im.save(path + ".png", optimize=True)
    else:
        im.convert("RGB").save(path + ".webp", quality=82, method=6)
        im.convert("RGB").save(path + ".jpg", quality=84, optimize=True, progressive=True)


def main():
    for name, (src, widths, alpha) in JOBS.items():
        orig = Image.open(os.path.join(SRC, src))
        for w in widths:
            if w > orig.width:
                continue
            h = round(orig.height * w / orig.width)
            im = orig.resize((w, h), Image.LANCZOS)
            save(im, os.path.join(OUT, f"{name}-{w}"), alpha)
            print(f"{name}-{w}  {w}x{h}")

    # og-картинка: белый вырез на светлом фоне, 1200x630
    car = Image.open(os.path.join(SRC, JOBS["car-white"][0]))
    og = Image.new("RGB", (1200, 630), (233, 233, 236))
    cw = 1160
    ch = round(car.height * cw / car.width)
    car = car.resize((cw, ch), Image.LANCZOS)
    og.paste(car, ((1200 - cw) // 2, (630 - ch) // 2), car)
    og.save(os.path.join(OUT, "og.jpg"), quality=88, optimize=True)
    print("og.jpg  1200x630")


if __name__ == "__main__":
    main()
