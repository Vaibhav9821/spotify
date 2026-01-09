from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
import shutil
import uuid
from pathlib import Path
from converters import pdf_tools, office_tools, image_tools

app = FastAPI()
BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

def save_upload(file: UploadFile) -> Path:
    file_id = uuid.uuid4().hex
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

@app.post("/convert/images-to-pdf")
async def images_to_pdf(files: list[UploadFile]):
    paths = [save_upload(f) for f in files]
    out_path = OUTPUT_DIR / f"{uuid.uuid4().hex}.pdf"
    pdf_tools.images_to_pdf(paths, out_path)
    return FileResponse(out_path, filename="converted.pdf")

@app.post("/convert/pdf-to-images")
async def pdf_to_images(file: UploadFile):
    pdf_path = save_upload(file)
    out_dir = OUTPUT_DIR / uuid.uuid4().hex
    out_dir.mkdir()
    image_tools.pdf_to_images(pdf_path, out_dir)
    # return zip of all images
    zip_path = shutil.make_archive(str(out_dir), 'zip', out_dir)
    return FileResponse(zip_path, filename="pdf_images.zip")

@app.post("/merge")
async def merge_pdfs(files: list[UploadFile]):
    paths = [save_upload(f) for f in files]
    out_path = OUTPUT_DIR / f"{uuid.uuid4().hex}.pdf"
    pdf_tools.merge_pdfs(paths, out_path)
    return FileResponse(out_path, filename="merged.pdf")

@app.post("/compress-pdf")
async def compress_pdf(file: UploadFile, size_kb: int = Form(...)):
    pdf_path = save_upload(file)
    out_path = OUTPUT_DIR / f"{uuid.uuid4().hex}.pdf"
    pdf_tools.compress_pdf(pdf_path, out_path, size_kb)
    return FileResponse(out_path, filename="compressed.pdf")

@app.post("/compress-image")
async def compress_image(file: UploadFile, size_kb: int = Form(...)):
    img_path = save_upload(file)
    out_path = OUTPUT_DIR / f"{uuid.uuid4().hex}{img_path.suffix}"
    image_tools.compress_image(img_path, out_path, size_kb)
    return FileResponse(out_path, filename="compressed_image" + img_path.suffix)

@app.post("/convert/office-to-pdf")
async def office_to_pdf(file: UploadFile):
    doc_path = save_upload(file)
    out_path = OUTPUT_DIR / f"{uuid.uuid4().hex}.pdf"
    office_tools.office_to_pdf(doc_path, out_path)
    return FileResponse(out_path, filename="converted.pdf")

@app.post("/convert/pdf-to-office")
async def pdf_to_office(file: UploadFile, format: str = Form(...)):
    pdf_path = save_upload(file)
    out_path = OUTPUT_DIR / f"{uuid.uuid4().hex}.{format}"
    office_tools.pdf_to_office(pdf_path, out_path, format)
    return FileResponse(out_path, filename=f"converted.{format}")
