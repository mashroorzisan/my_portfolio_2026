import os
import smtplib
from email.mime.text import MIMEText
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Message
from schemas import ContactMessage, MessageOut
from auth import require_admin

router = APIRouter(prefix="/api/contact", tags=["contact"])

def send_email_notification(msg: Message):
    """Send email notification when someone submits the contact form."""
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    notify_to = os.getenv("NOTIFY_EMAIL", "zisandue@gmail.com")

    if not all([smtp_host, smtp_user, smtp_pass]):
        return  # Email not configured — skip silently

    try:
        body = f"""New portfolio message from {msg.name}

From:    {msg.name} <{msg.email}>
Subject: {msg.subject}

{msg.body}

---
Reply directly to: {msg.email}
"""
        email = MIMEText(body)
        email["Subject"] = f"[Portfolio] {msg.subject}"
        email["From"]    = smtp_user
        email["To"]      = notify_to

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, notify_to, email.as_string())
    except Exception as e:
        print(f"Email notification failed: {e}")  # Don't crash the request

@router.post("")
def submit_message(payload: ContactMessage, db: Session = Depends(get_db)):
    m = Message(name=payload.name, email=payload.email, subject=payload.subject, body=payload.body)
    db.add(m); db.commit()
    send_email_notification(m)
    return {"ok": True}

@router.get("/messages", response_model=List[MessageOut])
def list_messages(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.desc()).all()

@router.put("/messages/{msg_id}/read")
def mark_read(msg_id: int, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    m = db.query(Message).filter(Message.id == msg_id).first()
    if not m:
        raise HTTPException(404, "Not found")
    m.read = True; db.commit()
    return {"ok": True}

@router.delete("/messages/{msg_id}")
def delete_message(msg_id: int, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    m = db.query(Message).filter(Message.id == msg_id).first()
    if not m:
        raise HTTPException(404, "Not found")
    db.delete(m); db.commit()
    return {"ok": True}
