import os
import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from auth import require_admin
from database import get_db, SessionLocal
from models import Setting
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = Path(__file__).parent.parent / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/hero")
async def upload_hero(
    file: UploadFile = File(...),
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return await _save_image(file, "hero_photo", db)

@router.post("/about")
async def upload_about(
    file: UploadFile = File(...),
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return await _save_image(file, "about_photo", db)

@router.delete("/hero")
def delete_hero(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return _delete_photo("hero_photo", db)

@router.delete("/about")
def delete_about(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return _delete_photo("about_photo", db)

async def _save_image(file: UploadFile, setting_key: str, db: Session):
    # Validate extension
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED:
        raise HTTPException(400, f"File type not allowed. Use: {', '.join(ALLOWED)}")

    # Read and check size
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(400, "File too large. Max 5MB.")

    # Delete old file if exists
    existing = db.query(Setting).filter(Setting.key == setting_key).first()
    if existing and existing.value:
        old_path = UPLOAD_DIR / Path(existing.value).name
        if old_path.exists():
            old_path.unlink()

    # Save new file with unique name
    filename = f"{setting_key}_{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / filename
    dest.write_bytes(contents)

    # Save URL to settings
    url = f"/static/uploads/{filename}"
    if existing:
        existing.value = url
    else:
        db.add(Setting(key=setting_key, value=url))
    db.commit()

    return {"url": url, "key": setting_key}

def _delete_photo(setting_key: str, db: Session):
    row = db.query(Setting).filter(Setting.key == setting_key).first()
    if row and row.value:
        path = UPLOAD_DIR / Path(row.value).name
        if path.exists():
            path.unlink()
        row.value = None
        db.commit()
    return {"ok": True}