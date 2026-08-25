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
# У выреза кузова поля обрезаются по альфе: в исходнике машина занимает
# 57 % ширины, и пустота съедала разрешение — на экране кадр растягивался
# вдвое и мылил. Координаты выносок в app.js сняты уже по обрезанному кадру.
CROP_ALPHA = {"car-white"}
JOBS = {
    "car-white":  ("pasted-1787529322652-0.png", (640, 955), True),
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
        # вырез — главная картинка сайта, качество выше остальных
        im.save(path + ".webp", quality=92, method=6)
        im.save(path + ".png", optimize=True)
    else:
        im.convert("RGB").save(path + ".webp", quality=82, method=6)
        im.convert("RGB").save(path + ".jpg", quality=84, optimize=True, progressive=True)


def main():
    for name, (src, widths, alpha) in JOBS.items():
        orig = Image.open(os.path.join(SRC, src))
        if name in CROP_ALPHA:
            bb = orig.getchannel("A").getbbox()
            mx = round((bb[2] - bb[0]) * 0.02)
            my = round((bb[3] - bb[1]) * 0.02)
            orig = orig.crop((max(0, bb[0] - mx), max(0, bb[1] - my),
                              min(orig.width, bb[2] + mx),
                              min(orig.height, bb[3] + my)))
            print(f"{name}: обрезан по альфе до {orig.width}x{orig.height}")
        for w in widths:
            if w > orig.width:
                continue
            h = round(orig.height * w / orig.width)
            im = orig.resize((w, h), Image.LANCZOS)
            save(im, os.path.join(OUT, f"{name}-{w}"), alpha)
            print(f"{name}-{w}  {w}x{h}")

    # og-картинка: белый вырез на светлом фоне, 1200x630
    car = Image.open(os.path.join(SRC, JOBS["car-white"][0]))
    bb = car.getchannel("A").getbbox()
    car = car.crop(bb)
    og = Image.new("RGB", (1200, 630), (233, 233, 236))
    cw = 1080
    ch = round(car.height * cw / car.width)
    car = car.resize((cw, ch), Image.LANCZOS)
    og.paste(car, ((1200 - cw) // 2, (630 - ch) // 2), car)
    og.save(os.path.join(OUT, "og.jpg"), quality=88, optimize=True)
    print("og.jpg  1200x630")


if __name__ == "__main__":
    main()
