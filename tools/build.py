#!/usr/bin/env python3
"""Собирает страницы сайта из src/ по общему каркасу src/layout.html.

Каждый файл в src/ (кроме layout.html) — это шапка «ключ: значение»,
строка `---`, дальше содержимое <main>. Шапка и подвал живут только
в layout.html, поэтому меню между страницами разъехаться не может.

Запуск: python3 tools/build.py
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def build():
    layout = (SRC / "layout.html").read_text()
    pages = sorted(p for p in SRC.glob("*.html") if p.name != "layout.html")
    names = [p.stem for p in pages]

    for page in pages:
        head, sep, body = page.read_text().partition("\n---\n")
        if not sep:
            sys.exit(f"{page.name}: нет строки --- между шапкой и содержимым")
        meta = dict(re.findall(r"^(\w+):\s*(.*)$", head, re.M))

        out = layout
        for name in names:
            out = out.replace("{{cur_%s}}" % name,
                              " is-current" if name == page.stem else "")
        out = out.replace("{{content}}", body.strip())
        out = (out.replace("{{title}}", meta.get("title", ""))
                  .replace("{{og_title}}", meta.get("og_title", meta.get("title", "")))
                  .replace("{{description}}", meta.get("description", ""))
                  .replace("{{path}}", "" if page.name == "index.html" else page.name))

        (ROOT / page.name).write_text(out)
        print("собрано", page.name)

        left = sorted(set(re.findall(r"\{\{(\w+)\}\}", out)))
        if left:
            print("  !! незаполненные плейсхолдеры:", left, file=sys.stderr)


if __name__ == "__main__":
    build()
