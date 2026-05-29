from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, JSON, String, Text
from database import Base

class Project(Base):
    __tablename__ = "projects"
    id             = Column(Integer, primary_key=True, index=True)
    slug           = Column(String, unique=True, index=True, nullable=False)
    title          = Column(String, nullable=False)
    tagline        = Column(String, nullable=False)
    category       = Column(String, nullable=False)        # AI | Data | Automation
    tags           = Column(JSON, default=[])
    featured       = Column(Boolean, default=False)
    date           = Column(String, default="")
    client         = Column(String, nullable=True)
    description    = Column(Text, default="")
    highlights     = Column(JSON, default=[])
    github         = Column(String, nullable=True)
    live           = Column(String, nullable=True)
    icon           = Column(String, default="🚀")
    readme_content = Column(Text, nullable=True)           # markdown
    video_url      = Column(String, nullable=True)
    order          = Column(Integer, default=0)
    created_at     = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SkillCategory(Base):
    __tablename__ = "skill_categories"
    id    = Column(Integer, primary_key=True, index=True)
    icon  = Column(String, default="🔧")
    title = Column(String, nullable=False)
    tags  = Column(JSON, default=[])
    order = Column(Integer, default=0)

class Setting(Base):
    """Key-value store for all about/site settings."""
    __tablename__ = "settings"
    key   = Column(String, primary_key=True)
    value = Column(Text, nullable=True)

class Experience(Base):
    __tablename__ = "experience"
    id           = Column(Integer, primary_key=True, index=True)
    type         = Column(String, default="work")          # work | education
    date         = Column(String, nullable=False)
    title        = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    description  = Column(Text, nullable=True)
    order        = Column(Integer, default=0)

class Certification(Base):
    __tablename__ = "certifications"
    id     = Column(Integer, primary_key=True, index=True)
    issuer = Column(String, nullable=False)
    name   = Column(String, nullable=False)
    date   = Column(String, default="")
    order  = Column(Integer, default=0)

class Message(Base):
    __tablename__ = "messages"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    email      = Column(String, nullable=False)
    subject    = Column(String, nullable=False)
    body       = Column(Text, nullable=False)
    read       = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Admin(Base):
    __tablename__ = "admins"
    id            = Column(Integer, primary_key=True, index=True)
    username      = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
