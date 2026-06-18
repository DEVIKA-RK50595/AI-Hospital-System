# MedRoute AI — Smart Hospital Triage Desk

MedRoute AI is an intelligent, automated hospital triage and patient routing platform. Built with a robust FastAPI backend powered by Google's Gemini Pro model via structured AI agents, the platform processes incoming patient symptoms, performs emergency risk categorization, determines appropriate medical departments, and logs information dynamically to a database. A clean, responsive React user interface ensures an intuitive digital reception experience.

### 🌐 Live Deployment Links
* **Frontend Interface:** [https://ai-hospital-system-seven.vercel.app](https://ai-hospital-system-seven.vercel.app)
* **Backend Server API:** [https://medroute-backend.onrender.com](https://medroute-backend.onrender.com)

---

## 🚀 Key Features

* **AI-Powered Patient Triage:** Leverages LLM-based reasoning via Gemini Pro to analyze complex symptom descriptions organically.
* **Structured Risk Assessment:** Categorizes emergencies into distinct priority bands (Critical, Urgent, Non-Urgent) with accompanying immediate safety directives.
* **Smart Department Routing:** Automatically maps patient needs to the most appropriate clinical specialty (e.g., Cardiology, Orthopedics, General Medicine).
* **Persistent Record Keeping:** Utilizes an integrated SQLite backend to log all incoming triaged cases, timestamps, and AI assessments for seamless intake tracking.
* **Modern Web Interface:** A fast, user-friendly SPA built using React, Vite, and Tailwind CSS.

---

## 🛠️ Tech Stack

### Backend Architecture
* **Language:** Python 3.14+
* **Framework:** FastAPI (Asynchronous API endpoints)
* **AI Engine:** Google Gemini API (via Google AI Studio)
* **Database:** SQLite3 (Lightweight relational storage)
* **Server Runner:** Uvicorn

### Frontend Interface
* **Framework:** React.js (via Vite)
* **Styling:** CSS3 / Tailwind CSS
* **Hosting Platform:** Vercel

---

## 📁 Project Directory Structure

```text
AI-Hospital-System/
│
├── main.py                 # FastAPI backend entry point & REST endpoints
├── agent.py                # Gemini AI agent reasoning & structured logic
├── requirements.txt        # Backend dependencies checklist
├── hospital_triage.db      # SQLite production database instance
│
├── hospital-ui/            # Frontend application root
│   ├── src/
│   │   ├── App.jsx         # React Core UI components & API fetch handling
│   │   ├── main.jsx        # DOM mounting setup
│   │   └── index.css       # Layout styles
│   ├── package.json        # Node dependencies & scripts
│   └── vite.config.js      # Vite compilation configuration
└── README.md               # Documentation guide
