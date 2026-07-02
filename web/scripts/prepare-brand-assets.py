"""
One-off script: convert the Maxime brand logo to transparent PNG assets.

Usage (from web/):
  python scripts/prepare-brand-assets.py [source.png]
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = Path(__file__).resolve().parents[2].parent / ".cursor" / "projects" / "c-Users-sahit-Downloads-esports-project" / "assets"
DEFAULT_SOURCE = ASSETS / (
    "c__Users_sahit_AppData_Roaming_Cursor_User_workspaceStorage_69c09383a"
    "9e701fe274fc148353b61f9_images_Maxime_Logo-4db63cf1-cfa1-4e4f-b888-cf73300bc487.png"
)

# Stacked lockup content zoom (center-crop; same canvas size).
STACKED_ZOOM = 1.18


def resolve_source() -> Path:
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).resolve()
    if DEFAULT_SOURCE.exists():
        return DEFAULT_SOURCE
    raise FileNotFoundError(
        "Source logo not found. Pass path: python scripts/prepare-brand-assets.py <source.png>"
    )


def make_transparent(img: Image.Image, threshold: int = 40) -> Image.Image:
    """Convert near-black background pixels to transparent."""
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def trim_transparent(img: Image.Image, padding: int = 4) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)
    return img.crop((left, top, right, bottom))


def zoom_content(img: Image.Image, scale: float, padding: int = 2) -> Image.Image:
    """Scale artwork up, then center-crop back to the original canvas so icons read larger."""
    trimmed = trim_transparent(img, padding=padding)
    ow, oh = trimmed.size
    if scale <= 1.0:
        return trimmed
    scaled = trimmed.resize(
        (max(1, int(ow * scale)), max(1, int(oh * scale))),
        Image.Resampling.LANCZOS,
    )
    sw, sh = scaled.size
    left = max(0, (sw - ow) // 2)
    top = max(0, (sh - oh) // 2)
    return scaled.crop((left, top, left + ow, top + oh))


def crop_emblem(stacked: Image.Image) -> Image.Image:
    """Crop emblem-only region from stacked lockup (top ~62% of height)."""
    w, h = stacked.size
    emblem_bottom = int(h * 0.62)
    emblem = stacked.crop((0, 0, w, emblem_bottom))
    return trim_transparent(emblem, padding=2)


def square_fit(img: Image.Image, size: int) -> Image.Image:
    """Center emblem in a square canvas, then resize."""
    w, h = img.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - w) // 2, (side - h) // 2), img)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    source = resolve_source()
    print(f"Source: {source}")

    raw = Image.open(source)
    base = trim_transparent(make_transparent(raw), padding=2)

    stacked = zoom_content(base, STACKED_ZOOM, padding=0)
    stacked_path = PUBLIC / "maxime-logo-stacked.png"
    stacked.save(stacked_path, optimize=True)
    stacked_dims = (stacked.width, stacked.height)
    print(f"Wrote {stacked_path} ({stacked.width}x{stacked.height}, zoom={STACKED_ZOOM})")

    emblem = crop_emblem(base)
    emblem = zoom_content(emblem, 1.18, padding=0)
    mark_path = PUBLIC / "maxime-mark.png"
    square_fit(emblem, 256).save(mark_path, optimize=True)
    print(f"Wrote {mark_path}")

    apple_path = PUBLIC / "apple-touch-icon.png"
    square_fit(emblem, 180).save(apple_path, optimize=True)
    print(f"Wrote {apple_path}")

    icon_path = ROOT / "src" / "app" / "icon.png"
    square_fit(emblem, 256).save(icon_path, optimize=True)
    print(f"Wrote {icon_path}")

    if stacked_dims:
        print(f"STACK_W={stacked_dims[0]} STACK_H={stacked_dims[1]}")


if __name__ == "__main__":
    main()
