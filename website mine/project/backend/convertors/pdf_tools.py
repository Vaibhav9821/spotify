from PIL import Image
from PyPDF2 import PdfMerger
import subprocess
from pathlib import Path

def images_to_pdf(image_paths, output_path: Path):
    images = [Image.open(p).convert("RGB") for p in image_paths]
    images[0].save(output_path, save_all=True, append_images=images[1:])

def merge_pdfs(pdf_paths, output_path: Path):
    merger = PdfMerger()
    for p in pdf_paths:
        merger.append(str(p))
    merger.write(output_path)
    merger.close()

def compress_pdf(input_path: Path, output_path: Path, size_kb: int):
    subprocess.run([
        "gs", "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook",
        "-dNOPAUSE", "-dQUIET", "-dBATCH",
        f"-sOutputFile={output_path}", str(input_path)
    ])
