"""Remove light gray textured background from logo; keep black artwork opaque."""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo.png"
OUT = ROOT / "public" / "logo.png"


def remove_background(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.float32)
    rgb = arr[..., :3]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    saturation = np.divide(max_c - min_c, max_c, out=np.zeros_like(max_c), where=max_c > 0)

    # Background: light gray paper texture (high luminance, low saturation)
    is_bg = (luminance >= 165) & (saturation <= 0.22)

    # Soft edge: fade near-threshold pixels for cleaner anti-aliasing on black edges
    edge = (luminance >= 145) & (luminance < 195) & (saturation <= 0.28)
    alpha = np.where(is_bg, 0.0, 255.0)
    alpha = np.where(edge, np.clip((195 - luminance) / 50 * 255, 0, 255), alpha)

    # Preserve solid black logo marks
    is_ink = luminance < 120
    alpha = np.where(is_ink, 255.0, alpha)

    out = arr.copy()
    out[..., 3] = alpha.astype(np.uint8)
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def main() -> None:
    img = Image.open(SRC)
    result = remove_background(img)
    result.save(OUT, "PNG", optimize=True)
    print(f"Saved transparent logo to {OUT} ({result.size[0]}x{result.size[1]})")


if __name__ == "__main__":
    main()
