from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Admin
from auth import verify_password, create_token, hash_password, require_admin
from schemas import LoginRequest, TokenResponse, ChangePasswordRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == payload.username).first()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": admin.username})
    return {"access_token": token}

@router.put("/password")
def change_password(
    payload: ChangePasswordRequest,
    username: str  = Depends(require_admin),
    db: Session    = Depends(get_db),
):
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not verify_password(payload.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Current password is wrong")
    admin.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"ok": True}