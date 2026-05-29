import os
from sqlalchemy.orm import Session
from auth import hash_password
from models import Admin, Project, SkillCategory, Setting, Experience, Certification

DEFAULT_SETTINGS = {
    "name":           "Ishtiaque Ahmed",
    "tagline":        "Data Scientist & AI Developer",
    "location":       "Dhaka, Bangladesh",
    "email":          "zisandue@gmail.com",
    "phone":          "+880 1680-802003",
    "resume_url":     "https://drive.google.com/file/d/1SIbdVuxeoL5oXiugeiu2L1oMcag9jsxV/view",
    "hero_sub":       "Physics graduate turned data scientist. I turn messy data into clear decisions and build AI tools that actually work.",
    "hero_roles":     '["Data Scientist","AI Developer","SQL Engineer","Python Developer","Automation Builder"]',
    "hero_stats":     '[{"target":25956,"suffix":"","label":"EHR Records Analyzed"},{"target":15000,"suffix":"+","label":"Records Scraped (Client)"},{"target":8,"suffix":"","label":"Projects Shipped"},{"target":94,"suffix":"","label":"GitHub Repos"}]',
    "about_heading":  "Physics taught me how to think. Data taught me what to build.",
    "about_paragraphs": '["I\'m Ishtiaque — a data scientist and AI developer from Dhaka, Bangladesh. My background in Physics and Applied Statistics isn\'t just academic; it\'s how I approach every problem: rigorously, curiously, and from first principles.","I\'ve done real work — analyzed 25,000+ healthcare records for a US company, built an LLM-powered adaptive study tool, automated data pipelines for international Upwork clients, and reverse-engineered $135K in retail losses through SQL.","Right now I\'m pursuing my M.Sc. in Applied Statistics & Data Science at Jahangirnagar University, and building toward a career at the intersection of data science and AI engineering — remote or otherwise."]',
    "social_links":   '[{"label":"GitHub","url":"https://github.com/mashroorzisan"},{"label":"LinkedIn","url":"https://linkedin.com/in/ishtiaquemashroor"},{"label":"Kaggle","url":"https://kaggle.com/ishtiaquemashroor"}]',
    "contact_sub":    "Open to data science roles, AI projects, freelance work, and remote opportunities worldwide.",
}

DEFAULT_SKILLS = [
    {"icon": "📊", "title": "Data & Analytics",         "tags": ["PostgreSQL","MySQL","Python","Pandas","NumPy","Power BI","Excel","Power Query","Tableau"], "order": 0},
    {"icon": "🤖", "title": "AI & Machine Learning",    "tags": ["LLMs","Groq API","LLaMA 3.3","Prompt Engineering","Streamlit","PyMuPDF","Applied Statistics"], "order": 1},
    {"icon": "⚙️", "title": "Automation & Engineering", "tags": ["Playwright","BeautifulSoup4","Node.js","Shopify API","Google Sheets API","Binance API","REST APIs"], "order": 2},
    {"icon": "🛠️", "title": "Tools & Workflow",         "tags": ["Git","GitHub","Jupyter","Retool","VS Code","FastAPI","Django","Linux"], "order": 3},
]

DEFAULT_PROJECTS = [
    {
        "slug": "adaptive-prep-system", "title": "Adaptive Prep System",
        "tagline": "LLM-powered study tool that learns your weak spots",
        "category": "AI", "featured": True, "order": 0, "icon": "🧠",
        "tags": ["Python","Groq","LLaMA 3.3","Streamlit","PDF Parsing"],
        "date": "2025", "client": "Personal Project",
        "description": "CLI + Streamlit app that parses any PDF, auto-generates MCQs using LLaMA 3.3-70b via Groq, and adapts future questions based on the user's wrong answers.",
        "highlights": ["LLM prompt injection for adaptive difficulty","Persistent knowledge base tracks performance","3-iteration evaluation with structured JSON output","PDF parsed with PyMuPDF; runs on free Groq API tier"],
        "github": "https://github.com/mashroorzisan/adaptive_prep_system",
        "readme_content": "# Adaptive Prep System\n\nAn LLM-powered adaptive study tool built with Python and Groq API.\n\n## How it works\n\n1. Upload any PDF\n2. System generates MCQs using LLaMA 3.3-70b\n3. Your wrong answers get injected back into the prompt\n4. Future questions focus on your weak areas\n\n## Tech Stack\n\n- **LLM**: LLaMA 3.3-70b via Groq API\n- **PDF Parsing**: PyMuPDF\n- **UI**: Streamlit\n- **Storage**: JSON-based knowledge base\n\n## Run locally\n\n```bash\npip install -r requirements.txt\nstreamlit run app.py\n```",
    },
    {
        "slug": "healthcare-rcm-analysis", "title": "Healthcare RCM Analysis",
        "tagline": "Found $1.35M+ in billing gaps across 25,956 EHR records",
        "category": "Data", "featured": True, "order": 1, "icon": "🏥",
        "tags": ["SQL","Power Query","Excel","Retool","Healthcare"],
        "date": "April 2025", "client": "Commure / Augmedix",
        "description": "Independent assessment of Revenue Cycle Management. Analyzed 25,956 EHR records to uncover billing failures.",
        "highlights": ["1,352 missing encounters + 798 duplicates identified","63.7% of missing CPT codes were never billed","Root cause traced to schema rejection and sync failure","25 SQL queries: CTEs, window functions, LAG, ROW_NUMBER"],
        "github": "",
        "readme_content": "# Healthcare RCM Analysis\n\nIndependent assessment for Commure/Augmedix.\n\n## Scope\n\nAnalyzed **25,956 EHR records** across 6,452 imports to identify billing failures.\n\n## Key Findings\n\n| Issue | Count |\n|---|---|\n| Missing encounters | 1,352 |\n| Duplicate records | 798 |\n| Incomplete imports | 2 |\n| Successful imports | 6,452 |\n\n## Root Cause\n\n63.7% of missing CPT codes were billable procedures never billed to insurance. Root cause traced to **schema rejection** and **system sync failure** between EHR and billing systems.\n\n## Tools Used\n\n- Power Query & Excel for pipeline\n- 25 SQL queries (CTEs, window functions, LAG, ROW_NUMBER, NTILE)\n- Retool dashboard for stakeholder presentation",
    },
    {
        "slug": "binance-trading-bot", "title": "Binance Futures Trading Bot",
        "tagline": "Automated CLI bot with intelligent precision order handling",
        "category": "AI", "featured": True, "order": 2, "icon": "🤖",
        "tags": ["Python","Binance API","Automation","Finance","CLI"],
        "date": "2025", "client": "Personal Project",
        "description": "Python CLI tool for the Binance Futures API with auto-precision rounding.",
        "highlights": ["Supports MARKET and LIMIT orders","Auto-precision rounding per exchange LOT_SIZE rules","Full structured logging to bot_logs.log","Testnet-safe for strategy testing"],
        "github": "https://github.com/mashroorzisan/Trading_bot",
        "readme_content": "# Binance Futures Trading Bot\n\nA Python CLI tool for automated futures trading on Binance.\n\n## Features\n\n- **Smart precision handling** — auto-rounds quantities and prices to exchange rules\n- **Order types** — MARKET and LIMIT via interactive CLI\n- **Logging** — every request, success, and error written to `bot_logs.log`\n- **Time sync** — auto-syncs with Binance server time\n- **Testnet safe** — test strategies without real capital\n\n## Setup\n\n```bash\npip install python-binance\ncp .env.example .env\n# Add your Binance testnet API keys\npython bot.py\n```\n\n## Warning\n\nThis is for educational purposes. Never use real funds without thorough testing.",
    },
    {
        "slug": "superstore-sales-analysis", "title": "Superstore Sales Analysis",
        "tagline": "Detected $135,376 in discount-driven losses across 9,994 orders",
        "category": "Data", "featured": False, "order": 3, "icon": "🛒",
        "tags": ["PostgreSQL","Power BI","Python","SQL"],
        "date": "2025", "client": "Personal Project",
        "description": "End-to-end SQL and Power BI analysis of 4-year retail order data.",
        "highlights": ["11 SQL queries: CTEs, window functions, LAG","Orders at 40%+ discount averaged -$106 profit","Tables sub-category alone: -$17,725 loss","3-page Power BI dashboard"],
        "github": "https://github.com/mashroorzisan/super_store_sales_analysis",
        "readme_content": "# Superstore Sales Analysis\n\n## Overview\n\nDeep-dive analysis of **9,994 retail orders** from 2014–2017 using PostgreSQL and Power BI.\n\n## Key Findings\n\n- **$135,376 total losses** driven by high-discount orders\n- Orders at **40%+ discount** averaged **-$106 profit each**\n- **Tables sub-category** alone lost $17,725\n\n## SQL Techniques Used\n\n```sql\n-- Example: Discount tier analysis\nSELECT \n  CASE \n    WHEN discount >= 0.4 THEN 'High (40%+)'\n    WHEN discount >= 0.2 THEN 'Medium (20-40%)'\n    ELSE 'Low (<20%)'\n  END as discount_tier,\n  COUNT(*) as orders,\n  AVG(profit) as avg_profit\nFROM orders\nGROUP BY 1\nORDER BY avg_profit;\n```\n\n## Dashboard\n\n3-page Power BI dashboard covering executive KPIs, monthly trends, and product/region breakdown.",
    },
    {
        "slug": "marketing-campaign-analysis", "title": "Customer Personality Analysis",
        "tagline": "EDA pipeline uncovering spend patterns across 2,240 customers",
        "category": "Data", "featured": False, "order": 4, "icon": "📊",
        "tags": ["Python","Pandas","Matplotlib","EDA","Data Cleaning"],
        "date": "2025", "client": "Personal Project",
        "description": "Full data cleaning and EDA on a marketing dataset.",
        "highlights": ["Resolved nulls, outliers, and dirty categoricals","Engineered Age, Total_Spend, Customer_Days features","PhD/Master's holders outspend other segments","Widowed/single: highest campaign response rates"],
        "github": "https://github.com/mashroorzisan/marketing_campaign_analysis",
        "readme_content": "# Customer Personality Analysis\n\n## Dataset\n\n2,240 customer records with demographics, spending, and campaign response data.\n\n## Data Quality Issues Fixed\n\n| Issue | Count | Fix |\n|---|---|---|\n| Null values | 24 | Median imputation |\n| Impossible birth years | 3 | Removed |\n| Income outlier ($666,666) | 1 | Removed |\n| Dirty categoricals (YOLO, Absurd) | Multiple | Standardized |\n\n## Feature Engineering\n\n```python\ndf['Age'] = 2025 - df['Year_Birth']\ndf['Total_Spend'] = df[spend_cols].sum(axis=1)\ndf['Customer_Days'] = (datetime.now() - df['Dt_Customer']).dt.days\n```\n\n## Key Insights\n\n- **PhD/Master's** customers spend significantly more\n- **Widowed/single** segments show highest campaign response rates",
    },
    {
        "slug": "shopify-google-sheets-bridge", "title": "Shopify → Google Sheets Bridge",
        "tagline": "Real-time inventory and sales sync — no manual exports",
        "category": "Automation", "featured": False, "order": 5, "icon": "🔗",
        "tags": ["Node.js","Shopify API","Google Sheets API","Automation"],
        "date": "2024", "client": "Personal Project",
        "description": "Automated pipeline syncing live Shopify data to Google Sheets.",
        "highlights": ["Live inventory and sales data always in sync","Eliminates manual export/import workflows"],
        "github": "https://github.com/mashroorzisan/shopify-to-google-sheet-poject",
        "readme_content": "# Shopify → Google Sheets Bridge\n\nAutomated data pipeline that syncs Shopify store data to Google Sheets in real-time.\n\n## Problem Solved\n\nManually exporting CSVs from Shopify every day is tedious. This tool keeps your Google Sheet always up to date automatically.\n\n## Setup\n\n```bash\nnpm install\ncp .env.example .env\n# Add Shopify API keys and Google Sheets credentials\nnode index.js\n```\n\n## What it syncs\n\n- Orders (new, updated, fulfilled)\n- Inventory levels\n- Product catalog\n- Customer data",
    },
    {
        "slug": "linkedin-course-scraper", "title": "LinkedIn Course Transcript Scraper",
        "tagline": "15,000+ records extracted in 7 days for an international client",
        "category": "Automation", "featured": False, "order": 6, "icon": "🕷️",
        "tags": ["Python","Playwright","Pandas","OOP","Upwork"],
        "date": "2024", "client": "Upwork — International Client",
        "description": "OOP Playwright pipeline extracting 15,000+ LinkedIn course records.",
        "highlights": ["15,000+ records in 7 days","Handles infinite scroll and JS-rendered content","OOP architecture for maintainability","Delivered on Upwork on schedule"],
        "github": "https://github.com/mashroorzisan",
        "readme_content": "# LinkedIn Course Transcript Scraper\n\nBuilt for a paying Upwork client. Extracts course transcript data from LinkedIn Learning at scale.\n\n## Architecture\n\n```\nScraper (OOP)\n├── LoginHandler    — authenticates session\n├── CourseNavigator — handles pagination + infinite scroll\n├── DataExtractor   — parses transcript content\n└── ExcelExporter   — consolidates to Excel\n```\n\n## Performance\n\n- **15,000+** course records extracted\n- Completed in **7 days**\n- Zero downtime during run\n\n## Tech\n\n- Playwright for browser automation\n- Pandas for data processing\n- openpyxl for Excel export",
    },
]

DEFAULT_EXPERIENCE = [
    {"type": "education", "date": "Jan 2026 — May 2027", "title": "M.Sc. Applied Statistics & Data Science",   "organization": "Jahangirnagar University, Dhaka",                           "description": None,                                                                                                                 "order": 0},
    {"type": "work",      "date": "June 2024 — Present", "title": "Web Scraping Expert — Freelance",           "organization": "Upwork",                                                    "description": "Delivered automated data extraction pipelines for international clients using Python, Playwright, and Pandas.", "order": 1},
    {"type": "work",      "date": "April 2025",          "title": "Healthcare RCM Analysis",                   "organization": "Commure / Augmedix (Independent Assessment)",                "description": "Analyzed 25,956 EHR records; identified 1,352 missing encounters and root-cause billing failures.",           "order": 2},
    {"type": "education", "date": "Graduated 2025",      "title": "B.Sc. Physics",                             "organization": "Hajee Mohammad Danesh Science and Technology University",    "description": None,                                                                                                                 "order": 3},
]

DEFAULT_CERTS = [
    {"issuer": "HackerRank",            "name": "SQL (Advanced)",                               "date": "Jan 2026", "order": 0},
    {"issuer": "IBM / Coursera",        "name": "Python for Data Science, AI & Development",    "date": "May 2024", "order": 1},
    {"issuer": "University of Michigan","name": "Database Design & Basic SQL (PostgreSQL)",      "date": "Apr 2024", "order": 2},
]


def seed(db: Session):
    # Admin
    if not db.query(Admin).first():
        admin_password = os.getenv("ADMIN_PASSWORD", "ishtiaque2025")
        db.add(Admin(username="ishtiaque", password_hash=hash_password(admin_password)))
        print(f"✓ Admin created — username: ishtiaque")

    # Settings
    if not db.query(Setting).first():
        for key, value in DEFAULT_SETTINGS.items():
            db.add(Setting(key=key, value=value))
        print("✓ Settings seeded")

    # Skills
    if not db.query(SkillCategory).first():
        for s in DEFAULT_SKILLS:
            db.add(SkillCategory(**s))
        print("✓ Skills seeded")

    # Projects
    if not db.query(Project).first():
        for p in DEFAULT_PROJECTS:
            db.add(Project(**p))
        print("✓ Projects seeded")

    # Experience
    if not db.query(Experience).first():
        for e in DEFAULT_EXPERIENCE:
            db.add(Experience(**e))
        print("✓ Experience seeded")

    # Certs
    if not db.query(Certification).first():
        for c in DEFAULT_CERTS:
            db.add(Certification(**c))
        print("✓ Certifications seeded")

    db.commit()
