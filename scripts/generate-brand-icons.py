#!/usr/bin/env python3
"""Generate TORENTO brand assets.

- PWA icons (192/512) from `public/brand/torento-app-icon-source.jpg`
- Favicon (32 + .ico) from `public/brand/torento-favicon-source.png` (black mark)
- Wide on-black logo from `public/brand/torento-logo.png` when present
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "brand"
APP_ICON_SRC = OUT_DIR / "torento-app-icon-source.jpg"
FAVICON_SRC = OUT_DIR / "torento-favicon-source.png"
WORDMARK_SRC = OUT_DIR / "torento-logo.png"
BLACK = (0, 0, 0, 255)
CREAM = (236, 227, 209, 255)  # #ECE3D1 — readable behind black mark in browser tabs


def fit_on_canvas(
    logo: Image.Image,
    size: int,
    margin_ratio: float,
    bg: tuple[int, int, int, int],
) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg)
    max_w = int(size * (1 - 2 * margin_ratio))
    max_h = int(size * (1 - 2 * margin_ratio))
    lw, lh = logo.size
    scale = min(max_w / lw, max_h / lh)
    nw, nh = max(1, int(lw * scale)), max(1, int(lh * scale))
    resized = logo.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(resized, (x, y), resized if resized.mode == "RGBA" else None)
    return canvas


def crop_to_opaque(im: Image.Image) -> Image.Image:
    bbox = im.getchannel("A").getbbox()
    return im.crop(bbox) if bbox else im


def write_pwa_icons(source: Image.Image) -> None:
    rgba = source.convert("RGBA")
    for size in (192, 512):
        icon = rgba.resize((size, size), Image.Resampling.LANCZOS)
        path = OUT_DIR / f"icon-{size}.png"
        icon.convert("RGB").save(path, "PNG", optimize=True)
        print(f"Wrote {path.relative_to(ROOT)}")


def write_favicon(source: Image.Image) -> None:
    logo = crop_to_opaque(source.convert("RGBA"))
    fav = fit_on_canvas(logo, 32, margin_ratio=0.10, bg=CREAM)
    fav_path = OUT_DIR / "favicon-32.png"
    fav.convert("RGB").save(fav_path, "PNG", optimize=True)
    print(f"Wrote {fav_path.relative_to(ROOT)}")

    ico = fit_on_canvas(logo, 256, margin_ratio=0.10, bg=CREAM)
    ico_path = ROOT / "public" / "favicon.ico"
    ico.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Wrote {ico_path.relative_to(ROOT)}")


def write_on_black_wordmark(logo: Image.Image) -> None:
    pad = 48
    on_black = Image.new("RGBA", (logo.width + pad * 2, logo.height + pad * 2), BLACK)
    on_black.paste(logo, (pad, pad), logo)
    on_black_path = OUT_DIR / "torento-logo-on-black.png"
    on_black.convert("RGB").save(on_black_path, "PNG", optimize=True)
    print(f"Wrote {on_black_path.relative_to(ROOT)}")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if APP_ICON_SRC.exists():
        write_pwa_icons(Image.open(APP_ICON_SRC))
    else:
        print(f"Skip PWA icons (missing {APP_ICON_SRC.name})")

    if FAVICON_SRC.exists():
        write_favicon(Image.open(FAVICON_SRC))
    else:
        print(f"Skip favicon (missing {FAVICON_SRC.name})")

    if WORDMARK_SRC.exists():
        write_on_black_wordmark(Image.open(WORDMARK_SRC).convert("RGBA"))
    else:
        print(f"Skip on-black wordmark (missing {WORDMARK_SRC.name})")


if __name__ == "__main__":
    main()
