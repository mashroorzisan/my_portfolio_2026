from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Setting
from auth import require_admin

router = APIRouter(prefix="/api/about", tags=["about"])

@router.get("")
def get_about(db: Session = Depends(get_db)) -> Dict[str, Any]:
    rows = db.query(Setting).all()
    return {r.key: r.value for r in rows}

@router.put("")
def update_about(
    payload: Dict[str, Any],
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    for key, value in payload.items():
        row = db.query(Setting).filter(Setting.key == key).first()
        if row:
            row.value = str(value)
        else:
            db.add(Setting(key=key, value=str(value)))
    db.commit()
    return {"ok": True}
