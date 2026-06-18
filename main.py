from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from agent import hospital_agent

app = FastAPI()

# Enable connection to your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE MANAGEMENT SETUP ---
import os

IS_RENDER = os.environ.get("RENDER")
DB_FILE = "/data/hospital_triage.db" if IS_RENDER else "hospital_triage.db"

def init_db():
    """Creates the database and patient triage table if it doesn't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patient_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_query TEXT,
            triage_category TEXT,
            assigned_ward TEXT,
            receptionist_reply TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Initialize the database immediately on script startup
init_db()
# ---------------------------------

class TriageRequest(BaseModel):
    query: str = ""
    message: str = "" 

@app.post("/triage")
async def triage_endpoint(request: TriageRequest):
    patient_text = request.query if request.query else request.message
    if not patient_text:
        patient_text = "General inquiry"
        
    # Run our LangGraph workflow
    response = await hospital_agent.ainvoke({"query": patient_text})
    
    # --- SAVE TO DATABASE (Data Management) ---
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO patient_records (patient_query, triage_category, assigned_ward, receptionist_reply)
            VALUES (?, ?, ?, ?)
        """, (patient_text, response.get("category"), response.get("ward"), response.get("reply")))
        conn.commit()
        conn.close()
        print("💾 Success: Patient triage data saved securely to hospital_triage.db")
    except Exception as e:
        print(f"❌ Database Error: {e}")
    # -------------------------------------------
        
    return response
