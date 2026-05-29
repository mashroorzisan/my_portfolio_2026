from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project
from schemas import ProjectCreate, ProjectOut, ProjectUpdate
from auth import require_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.order, Project.id).all()

@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

@router.post("", response_model=ProjectOut)
def create_project(
    payload: ProjectCreate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if db.query(Project).filter(Project.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Slug already exists")
    p = Project(**payload.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in payload.model_dump().items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    return p

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(p); db.commit()
    return {"ok": True}
