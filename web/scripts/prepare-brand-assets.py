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
ASSETS = Path.home() / ".cursor" / "projects" / "c-Users-sahit-Downloads-esports-project" / "assets"
DEFAULT_SOURCE = ASSETS / (
    "c__Users_sahit_AppData_Roaming_Cursor_User_workspaceStorage_69c09383a"
    "9e701fe274fc148353b61f9_images_maxime_logo_transparent-de137b14-6613-4972-b593-"
    "9f1aadd35035.png"
)


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


def row_alpha_occupancy(img: Image.Image, alpha_threshold: int = 10) -> list[float]:
    rgba = img.convert("RGBA")
    alpha = rgba.split()[3]
    w, h = rgba.size
    return [
        sum(1 for x in range(w) if alpha.getpixel((x, y)) > alpha_threshold) / w
        for y in range(h)
    ]


def find_row_blocks(row_occ: list[float], threshold: float = 0.02) -> list[tuple[int, int]]:
    blocks: list[tuple[int, int]] = []
    in_block = False
    start = 0
    for i, v in enumerate(row_occ):
        if v > threshold and not in_block:
            start = i
            in_block = True
        elif v <= threshold and in_block:
            blocks.append((start, i - 1))
            in_block = False
    if in_block:
        blocks.append((start, len(row_occ) - 1))
    return blocks


def crop_block_tight(img: Image.Image, row_start: int, row_end: int) -> Image.Image:
    block = img.crop((0, row_start, img.width, row_end + 1))
    return trim_transparent(block, padding=0)


def tight_stacked_recomposite(
    img: Image.Image,
    gap: int = 10,
    edge_padding: int = 2,
) -> Image.Image:
    """Trim padding between emblem and wordmark without cropping into artwork."""
    row_occ = row_alpha_occupancy(img)
    blocks = find_row_blocks(row_occ)
    if len(blocks) < 2:
        return trim_transparent(img, padding=edge_padding)

    parts = [crop_block_tight(img, start, end) for start, end in blocks]
    total_h = sum(part.height for part in parts) + gap * (len(parts) - 1) + edge_padding * 2
    max_w = max(part.width for part in parts) + edge_padding * 2

    canvas = Image.new("RGBA", (max_w, total_h), (0, 0, 0, 0))
    y = edge_padding
    for i, part in enumerate(parts):
        x = (max_w - part.width) // 2
        canvas.paste(part, (x, y), part)
        y += part.height
        if i < len(parts) - 1:
            y += gap
    return canvas


def crop_emblem(stacked: Image.Image) -> Image.Image:
    """Crop emblem-only region from the top visual block of the stacked lockup."""
    row_occ = row_alpha_occupancy(stacked)
    blocks = find_row_blocks(row_occ)
    if not blocks:
        w, h = stacked.size
        emblem = stacked.crop((0, 0, w, int(h * 0.62)))
        return trim_transparent(emblem, padding=2)
    start, end = blocks[0]
    return trim_transparent(crop_block_tight(stacked, start, end), padding=2)


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
    base = trim_transparent(make_transparent(raw), padding=4)
    # Recomposite emblem + wordmark with a tighter gap — trims padding, not artwork.
    stacked = tight_stacked_recomposite(base, gap=16, edge_padding=2)
    stacked_path = PUBLIC / "maxime-logo-stacked.png"
    stacked.save(stacked_path, optimize=True)
    print(f"Wrote {stacked_path} ({stacked.width}x{stacked.height})")

    emblem = crop_emblem(stacked)
    mark_path = PUBLIC / "maxime-mark.png"
    square_fit(emblem, 256).save(mark_path, optimize=True)
    print(f"Wrote {mark_path}")

    apple_path = PUBLIC / "apple-touch-icon.png"
    square_fit(emblem, 180).save(apple_path, optimize=True)
    print(f"Wrote {apple_path}")

    icon_path = ROOT / "src" / "app" / "icon.png"
    square_fit(emblem, 256).save(icon_path, optimize=True)
    print(f"Wrote {icon_path}")

    print(f"STACK_W={stacked.width} STACK_H={stacked.height}")


if __name__ == "__main__":
    main()
