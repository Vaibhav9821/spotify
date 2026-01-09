from PIL import Image
import subprocess
from pathlib import Path

def pdf_to_images(pdf_path: Path, output_dir: Path):
    subprocess.run(["pdftoppm", str(pdf_path), str(output_dir / "page"), "-png"])

def compress_image(input_path: Path, output_path: Path, size_kb: int):
    img = Image.open(input_path)
    quality = 85
    while True:
        img.save(output_path, optimize=True, quality=quality)
        if output_path.stat().st_size <= size_kb * 1024 or quality <= 10:
            break
        quality -= 5
