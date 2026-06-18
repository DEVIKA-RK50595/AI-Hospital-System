import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Error reaching the AI server. Is your FastAPI backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  // Safe helper to evaluate categories regardless of casing (UPPERCASE or lowercase)
  const getCategory = () => {
    if (!result || !result.category) return "";
    return result.category.toLowerCase();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "sans-serif", padding: "20px" }}>
      {/* Fixed Layout Title Container */}
      <div style={{ maxWidth: "600px", margin: "40px auto 20px auto", textAlign: "center", backgroundColor: "#2563eb", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "2rem", fontWeight: "bold" }}>MedRoute AI</h1>
        <p style={{ color: "#bfdbfe", margin: "4px 0 0 0", fontSize: "1rem" }}>Smart Hospital Triage Desk</p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "600", color: "#1e293b", marginBottom: "12px", textAlign: "center" }}>
            How can we help you today?
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your symptoms or request..."
            style={{ width: "100%", height: "120px", padding: "12px", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", resize: "none", marginBottom: "16px" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", backgroundColor: loading ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", transition: "background-color 0.2s" }}
          >
            {loading ? "Processing Triage Analysis..." : "Submit to Triage Desk"}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "2px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "1.2rem", textAlign: "center" }}>Assessment Breakdown:</h3>
            
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: 1, backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "4px" }}>TRIAGE PRIORITY</span>
                <span style={{ 
                  fontSize: "1.2rem", 
                  fontWeight: "700", 
                  color: getCategory() === "emergency" ? "#dc2626" : getCategory() === "appointment" ? "#d97706" : "#2563eb"
                }}>
                  {getCategory().toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1, backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "4px" }}>ASSIGNED STATION</span>
                <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#1e293b" }}>
                  {result.ward || "General Reception"}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: getCategory() === "emergency" ? "#fef2f2" : "#f0fdf4", padding: "16px", borderRadius: "8px", border: getCategory() === "emergency" ? "1px solid #fee2e2" : "1px solid #dcfce7" }}>
              <span style={{ fontSize: "0.85rem", color: getCategory() === "emergency" ? "#991b1b" : "#166534", fontWeight: "700", display: "block", marginBottom: "6px" }}>
                RECEPTIONIST REPLY DIRECTIONS:
              </span>
              <p style={{ margin: 0, color: "#334155", fontSize: "1rem", lineHeight: "1.5" }}>{result.reply}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
