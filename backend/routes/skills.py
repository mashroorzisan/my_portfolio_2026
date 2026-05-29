"""skills.py"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import SkillCategory
from schemas import SkillCategoryCreate, SkillCategoryOut
from auth import require_admin

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("", response_model=List[SkillCategoryOut])
def list_skills(db: Session = Depends(get_db)):
    return db.query(SkillCategory).order_by(SkillCategory.order).all()

@router.post("", response_model=SkillCategoryOut)
def create_skill(payload: SkillCategoryCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    s = SkillCategory(**payload.model_dump())
    db.add(s); db.commit(); db.refresh(s)
    return s

@router.put("/{skill_id}", response_model=SkillCategoryOut)
def update_skill(skill_id: int, payload: SkillCategoryCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    s = db.query(SkillCategory).filter(SkillCategory.id == skill_id).first()
    if not s:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(s, k, v)
    db.commit(); db.refresh(s)
    return s

@router.delete("/{skill_id}")
def delete_skill(skill_id: int, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    s = db.query(SkillCategory).filter(SkillCategory.id == skill_id).first()
    if not s:
        raise HTTPException(404, "Not found")
    db.delete(s); db.commit()
    return {"ok": True}
