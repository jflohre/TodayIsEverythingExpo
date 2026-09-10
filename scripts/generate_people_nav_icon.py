from pathlib import Path
from PIL import Image, ImageDraw

base_dir = Path(__file__).resolve().parent.parent
icon_dir = base_dir / 'assets' / 'images' / 'tabIcons'
icon_dir.mkdir(parents=True, exist_ok=True)

for size in (96, 192, 288):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    head_r = size * 0.13
    left_x = size * 0.31
    right_x = size * 0.69
    top_y = size * 0.13
    body_top = size * 0.38
    body_bottom = size * 0.83
    shoulder_y = size * 0.7

    draw.ellipse((left_x - head_r, top_y, left_x + head_r, top_y + head_r * 2), fill=(255, 255, 255, 255))
    draw.rounded_rectangle((left_x - size * 0.18, body_top, left_x + size * 0.18, body_bottom), radius=size * 0.08, fill=(255, 255, 255, 255))

    draw.ellipse((right_x - head_r, top_y, right_x + head_r, top_y + head_r * 2), fill=(255, 255, 255, 255))
    draw.rounded_rectangle((right_x - size * 0.18, body_top, right_x + size * 0.18, body_bottom), radius=size * 0.08, fill=(255, 255, 255, 255))

    draw.rounded_rectangle((size * 0.18, shoulder_y, size * 0.82, size * 0.84), radius=size * 0.08, fill=(255, 255, 255, 255))

    suffix = '' if size == 96 else '@2x' if size == 192 else '@3x'
    img.save(icon_dir / f'people{suffix}.png')

print('Created people tab icon assets.')
