import os
import sys
from pathlib import Path

# Ensure backend/ is on the path so relative imports work correctly
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import Base, engine, SessionLocal
from seed import seed
from routes.auth import router as auth_router
from routes.projects import router as projects_router
from routes.skills import router as skills_router
from routes.about import router as about_router
from routes.experience import router as exp_router, cert_router
from routes.contact import router as contact_router
from routes.upload import router as upload_router, UPLOAD_DIR

# ── Create tables & seed ──────────────────────────────────────
Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    seed(db)

# ── App ───────────────────────────────────────────────────────
app = FastAPI(title="Portfolio API", docs_url="/api/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static uploads (user-uploaded photos) ────────────────────
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ── API routes ────────────────────────────────────────────────
for r in [auth_router, projects_router, skills_router, about_router,
          exp_router, cert_router, contact_router, upload_router]:
    app.include_router(r)

# ── Serve built frontend ──────────────────────────────────────
DIST = Path(__file__).parent.parent / "frontend" / "dist"

if DIST.exists():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        """Return index.html for all non-API routes (SPA fallback)."""
        index = DIST / "index.html"
        return FileResponse(index)
else:
    @app.get("/")
    def root():
        return {"status": "API running", "docs": "/api/docs", "note": "Build the frontend with: cd frontend && npm run build"}