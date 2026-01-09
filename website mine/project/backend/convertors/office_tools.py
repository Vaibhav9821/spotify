import subprocess
from pathlib import Path

def office_to_pdf(input_path: Path, output_path: Path):
    subprocess.run([
        "libreoffice", "--headless", "--convert-to", "pdf",
        "--outdir", str(output_path.parent), str(input_path)
    ])

def pdf_to_office(pdf_path: Path, output_path: Path, format: str):
    subprocess.run([
        "libreoffice", "--headless", "--convert-to", format,
        "--outdir", str(output_path.parent), str(pdf_path)
    ])
