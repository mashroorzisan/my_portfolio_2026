from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr

# ── Auth ──────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

# ── Projects ──────────────────────────────────────────────────
class ProjectBase(BaseModel):
    slug:           str
    title:          str
    tagline:        str
    category:       str
    tags:           List[str]     = []
    featured:       bool          = False
    date:           str           = ""
    client:         Optional[str] = None
    description:    str           = ""
    highlights:     List[str]     = []
    github:         Optional[str] = None
    live:           Optional[str] = None
    icon:           str           = "🚀"
    readme_content: Optional[str] = None
    video_url:      Optional[str] = None
    order:          int           = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id:         int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# ── Skills ────────────────────────────────────────────────────
class SkillCategoryBase(BaseModel):
    icon:  str
    title: str
    tags:  List[str] = []
    order: int       = 0

class SkillCategoryCreate(SkillCategoryBase):
    pass

class SkillCategoryOut(SkillCategoryBase):
    id: int
    class Config:
        from_attributes = True

# ── Settings ──────────────────────────────────────────────────
class SettingsUpdate(BaseModel):
    data: Dict[str, Any]

# ── Experience ────────────────────────────────────────────────
class ExperienceBase(BaseModel):
    type:         str           = "work"
    date:         str
    title:        str
    organization: str
    description:  Optional[str] = None
    order:        int           = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceOut(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

# ── Certifications ────────────────────────────────────────────
class CertificationBase(BaseModel):
    issuer: str
    name:   str
    date:   str  = ""
    order:  int  = 0

class CertificationCreate(CertificationBase):
    pass

class CertificationOut(CertificationBase):
    id: int
    class Config:
        from_attributes = True

# ── Contact ───────────────────────────────────────────────────
class ContactMessage(BaseModel):
    name:    str
    email:   EmailStr
    subject: str
    body:    str

class MessageOut(BaseModel):
    id:         int
    name:       str
    email:      str
    subject:    str
    body:       str
    read:       bool
    created_at: datetime
    class Config:
        from_attributes = True
