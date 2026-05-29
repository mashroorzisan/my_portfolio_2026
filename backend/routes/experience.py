from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Experience, Certification
from schemas import ExperienceCreate, ExperienceOut, CertificationCreate, CertificationOut
from auth import require_admin

router = APIRouter(prefix="/api/experience", tags=["experience"])

@router.get("", response_model=List[ExperienceOut])
def list_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order).all()

@router.post("", response_model=ExperienceOut)
def create_experience(payload: ExperienceCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    e = Experience(**payload.model_dump())
    db.add(e); db.commit(); db.refresh(e)
    return e

@router.put("/{exp_id}", response_model=ExperienceOut)
def update_experience(exp_id: int, payload: ExperienceCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    e = db.query(Experience).filter(Experience.id == exp_id).first()
    if not e:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(e, k, v)
    db.commit(); db.refresh(e)
    return e

@router.delete("/{exp_id}")
def delete_experience(exp_id: int, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    e = db.query(Experience).filter(Experience.id == exp_id).first()
    if not e:
        raise HTTPException(404, "Not found")
    db.delete(e); db.commit()
    return {"ok": True}

# ── Certifications ────────────────────────────────────────────
cert_router = APIRouter(prefix="/api/certifications", tags=["certifications"])

@cert_router.get("", response_model=List[CertificationOut])
def list_certs(db: Session = Depends(get_db)):
    return db.query(Certification).order_by(Certification.order).all()

@cert_router.post("", response_model=CertificationOut)
def create_cert(payload: CertificationCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    c = Certification(**payload.model_dump())
    db.add(c); db.commit(); db.refresh(c)
    return c

@cert_router.put("/{cert_id}", response_model=CertificationOut)
def update_cert(cert_id: int, payload: CertificationCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    c = db.query(Certification).filter(Certification.id == cert_id).first()
    if not c:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(c, k, v)
    db.commit(); db.refresh(c)
    return c

@cert_router.delete("/{cert_id}")
def delete_cert(cert_id: int, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    c = db.query(Certification).filter(Certification.id == cert_id).first()
    if not c:
        raise HTTPException(404, "Not found")
    db.delete(c); db.commit()
    return {"ok": True}
