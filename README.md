# Ishtiaque Ahmed — Portfolio
portfolio link - [https://ishtiaque-mashroor.up.railway.app/] 
> Data Scientist & AI Developer • Full-stack portfolio with admin panel

**Stack:** React + TypeScript + Tailwind (frontend) · FastAPI + PostgreSQL (backend) · Render (hosting)

---

## 🚀 Deploy to Render (One-click)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Blueprint**
3. Connect your GitHub repo — Render reads `render.yaml` automatically
4. It will create:
   - A **PostgreSQL** database (free tier)
   - A **Web Service** (builds frontend + runs backend)
5. Set your `ADMIN_PASSWORD` in Render environment variables
6. Deploy — takes ~3 minutes on first build

**Your site:** `https://ishtiaque-portfolio.onrender.com`
**Admin panel:** `https://ishtiaque-portfolio.onrender.com/admin/login`

---

## 💻 Run Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example ../.env      # fill in your values
uvicorn main:app --reload
# API running at http://localhost:8000
# API docs at  http://localhost:8000/api/docs
```

### Frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:8000` automatically.

---

## 🔐 Admin Panel

URL: `/admin/login`

Default credentials (set in `render.yaml` or `.env`):
- Username: `ishtiaque`
- Password: `ishtiaque2025` ← **change this on first login via the Password tab**

### What you can manage without touching code:

| Tab | What you can do |
|---|---|
| **Projects** | Add / edit / delete projects. Write full Markdown README per project. Add video URL (YouTube, Vimeo, mp4). Toggle featured. |
| **Skills** | Add / edit / delete skill categories and tags |
| **About & Site** | Name, tagline, bio paragraphs, hero stats, resume link, social links, contact text |
| **Experience** | Add / edit / delete work and education timeline entries |
| **Messages** | Read contact form submissions, reply via email, delete |
| **Password** | Change your admin password |

---

## ➕ Adding a New Project

1. Log in to `/admin/login`
2. Go to **Projects** tab
3. Click **+ New Project**
4. Fill in the form:
   - **Slug** → becomes the URL: `/project/my-slug`
   - **README** → full Markdown (supports code blocks, tables, images, headings)
   - **Video URL** → paste a YouTube/Vimeo link — it auto-embeds on the project page
5. Click **Create Project**
6. Done. It's live immediately. No deploy needed.

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── main.py          ← FastAPI app, serves built frontend
│   ├── models.py        ← Database tables (SQLAlchemy)
│   ├── schemas.py       ← Request/response types (Pydantic)
│   ├── auth.py          ← JWT authentication
│   ├── seed.py          ← Initial data on first run
│   ├── database.py      ← DB connection
│   ├── requirements.txt
│   └── routes/
│       ├── auth.py
│       ├── projects.py
│       ├── skills.py
│       ├── about.py
│       ├── experience.py
│       └── contact.py
├── frontend/
│   └── src/
│       ├── api/client.ts        ← All API calls
│       ├── contexts/AuthContext.tsx
│       ├── types/index.ts
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── ProjectDetail.tsx
│       │   └── admin/
│       │       ├── Login.tsx
│       │       ├── Dashboard.tsx
│       │       └── tabs/ (Projects, Skills, About, Experience, Messages, Password)
│       └── components/
│           ├── layout/ (Navbar, Footer)
│           └── sections/ (Hero, About, Skills, Projects, Experience, Contact)
├── build.sh         ← Render build script
├── render.yaml      ← Render config (DB + web service)
├── .env.example
└── .gitignore
```

---

## 🖼 Adding Your Photo

Drop a file named `photo.jpg` into the `frontend/public/` folder.
To update: replace the file, push to GitHub. Render auto-deploys.

If no photo exists, your initials show automatically as a fallback.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL URL (Render sets this automatically) |
| `SECRET_KEY` | JWT signing secret (Render auto-generates) |
| `ADMIN_PASSWORD` | Your admin panel password |

---

*Built May 2026*
https://ishtiaque-portfolio-fkd0.onrender.com
