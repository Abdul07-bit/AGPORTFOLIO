"""Remove the white studio background from the portrait.

Usage:  python scripts/cutout-portrait.py   (then: npm run images)

How it works — tuned for a plain light studio backdrop:
1. Pixels that are near-white *and* connected to the image border are background.
   Light areas enclosed by the subject (white shirt, collar, cuffs) stay opaque.
2. A narrow band around the silhouette gets a soft alpha from how far each pixel
   is from the backdrop colour, so hair and shoulders get a natural edge.
3. Edge colours are "decontaminated" (the backdrop is subtracted out) so no white
   halo remains when the cutout sits on a dark page.
"""

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

SOURCE = "assets-src/portrait.png"
OUTPUT = "assets-src/portrait-cutout.png"

# Portrait-specific hints (pixel coordinates in the 1024x1536 source):
# the white shirt between the lapels touches the backdrop at the collar tips,
# so the flood fill must not enter it...
SHIRT = [(436, 620), (448, 576), (470, 580), (560, 588), (626, 552), (640, 572), (640, 930), (396, 930), (396, 700), (420, 650)]
# ...and backdrop visible *through* the gap between the right arm and the body
# is enclosed by the subject, so it is seeded explicitly.
ENCLOSED_BACKDROP_SEEDS = [(816, 1215)]
# Above the neckline every enclosed light pocket is backdrop showing between hair strands.
HAIRLINE_Y = 480

image = np.asarray(Image.open(SOURCE).convert("RGB")).astype(np.float32)
height, width, _ = image.shape

# Backdrop colour: median of a thin border strip (excluding the bottom, where the suit is).
border = np.concatenate([image[:12].reshape(-1, 3), image[:, :12].reshape(-1, 3), image[:, -12:].reshape(-1, 3)])
backdrop = np.median(border, axis=0)

# Distance from the backdrop colour (0 = backdrop).
distance = np.sqrt(((image - backdrop) ** 2).sum(axis=2))

# 1. Background = near-backdrop pixels connected to the top/left/right borders.
protect = Image.new("L", (width, height), 0)
ImageDraw.Draw(protect).polygon(SHIRT, fill=1)
candidate = (distance < 30) & ~np.asarray(protect, dtype=bool)
labels, _ = ndimage.label(candidate)
edge_labels = np.concatenate([labels[0], labels[:, 0], labels[:, -1]])
seed_labels = np.array([labels[y, x] for x, y in ENCLOSED_BACKDROP_SEEDS])
centroids = ndimage.center_of_mass(candidate, labels, range(1, labels.max() + 1))
hair_labels = np.array([index + 1 for index, (cy, _) in enumerate(centroids) if cy < HAIRLINE_Y])
keep = np.unique(np.concatenate([edge_labels, seed_labels, hair_labels]))
background = np.isin(labels, keep[keep != 0])
background = ndimage.binary_opening(background, iterations=1)

# 2. Soft alpha in a band around the silhouette.
subject = ~background
band = ndimage.binary_dilation(subject, iterations=3) & ndimage.binary_dilation(background, iterations=3)
soft = np.clip((distance - 12) / (70 - 12), 0, 1)
alpha = subject.astype(np.float32)
alpha[band] = np.maximum(soft[band], alpha[band] * soft[band])
# Hair: fine strands are a blend of dark hair and white backdrop, so near the
# silhouette (and only for neutral, non-skin colours) alpha comes from brightness.
rows = np.arange(height)[:, None]
to_background = ndimage.distance_transform_edt(~background)
chroma = image.max(axis=2) - image.min(axis=2)
hair_zone = subject & (to_background < 24) & (chroma < 28) & (rows < HAIRLINE_Y + 40)
luminance = image.mean(axis=2)
hair_alpha = np.clip((backdrop.mean() - luminance) / (backdrop.mean() - 40), 0, 1) ** 0.85
alpha[hair_zone] = np.minimum(alpha[hair_zone], hair_alpha[hair_zone])

alpha = ndimage.gaussian_filter(alpha, sigma=0.7)
alpha[background & ~band] = 0
alpha = np.clip(alpha, 0, 1)

# 3. Decontaminate semi-transparent edge pixels: F = (C - (1 - a) * B) / a.
edge = (alpha > 0.02) & (alpha < 0.98)
a = alpha[edge][:, None]
image[edge] = np.clip((image[edge] - (1 - a) * backdrop) / a, 0, 255)

rgba = np.dstack([image, alpha * 255]).round().astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(OUTPUT, optimize=True)

kept = alpha.mean() * 100
print(f"backdrop {backdrop.round().astype(int).tolist()} -> {OUTPUT} ({kept:.1f}% of pixels kept)")
