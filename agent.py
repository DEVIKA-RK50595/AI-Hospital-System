import os
from typing import Dict, Any
from langgraph.graph import StateGraph, END
# 1. Import Google Gemini instead of OpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

# Define the shared state between nodes
class AgentState(BaseModel):
    query: str = ""
    category: str = ""
    ward: str = ""
    reply: str = ""

# 2. Initialize the free Gemini model
# Note: Google models accept structured outputs beautifully!
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

# Pydantic schemas for structuring our AI's mind
class ClassificationSchema(BaseModel):
    category: str = Field(description="Must be exactly: 'emergency', 'appointment', or 'general'")
    ward: str = Field(description="Assigned clinic desk like Emergency Room, Pediatrics, General OPD, etc.")

class ResponseSchema(BaseModel):
    reply: str = Field(description="A helpful, professional message tailored to the patient's triage state.")

def classifier_node(state: AgentState) -> Dict[str, Any]:
    structured_llm = llm.with_structured_output(ClassificationSchema)
    
    prompt = f"""You are an elite hospital triage system. Analyze this patient query: "{state.query}"
    Categorize it into one of these:
    - 'emergency': Life-threatening symptoms (chest pain, heavy bleeding, breathing failure) -> Ward: 'Emergency Room'
    - 'appointment': Requesting a checkup, booking, or routine visit -> Ward: Appropriate specialist (e.g., Pediatrics, Cardiology)
    - 'general': Asking for directions, hours, or generic hospitality info -> Ward: 'General OPD' / 'Information Desk'
    """
    
    result = structured_llm.invoke(prompt)
    return {
        "category": result.category.lower(),
        "ward": result.ward
    }

def responder_node(state: AgentState) -> Dict[str, Any]:
    structured_llm = llm.with_structured_output(ResponseSchema)
    
    prompt = f"""You are the medical receptionist. Write a response based on this triage:
    Patient Query: {state.query}
    Triage Category: {state.category}
    Assigned Destination: {state.ward}
    
    Keep the tone reassuring and brief. Tell them what steps to take next.
    """
    
    result = structured_llm.invoke(prompt)
    return {"reply": result.reply}

# Build the LangGraph workflow layout
workflow = StateGraph(AgentState)
workflow.add_node("classifier", classifier_node)
workflow.add_node("responder", responder_node)

workflow.set_entry_point("classifier")
workflow.add_edge("classifier", "responder")
workflow.add_edge("responder", END)

hospital_agent = workflow.compile()