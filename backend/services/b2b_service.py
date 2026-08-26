import joblib
import pandas as pd
from pathlib import Path

ARTIFACTS_DIR = Path(__file__).parent.parent.parent / "artifacts" / "b2b"

# Load serialized artifacts
model = joblib.load(ARTIFACTS_DIR / "selected_model.pkl")
scaler = joblib.load(ARTIFACTS_DIR / "scaler.pkl")
biz_encoder = joblib.load(ARTIFACTS_DIR / "business_encoder.pkl")
terms_encoder = joblib.load(ARTIFACTS_DIR / "terms_encoder.pkl")

def evaluate_b2b_invoice(payload: dict):
    # Format features match your training schema
    biz_encoded = biz_encoder.transform([payload["business_code"]])[0]
    term_encoded = terms_encoder.transform([payload["payment_terms"]])[0]
    
    features = [[
        biz_encoded,
        payload["invoice_amount"],
        term_encoded,
        payload["dso"],
        payload["past_late_payments"],
        payload["days_overdue"]
    ]]
    
    scaled_feats = scaler.transform(features)
    prob_late = float(model.predict_proba(scaled_feats)[0][1])
    
    # Apply Risk Policy
    if prob_late > 0.70:
        tier = "HIGH"
        action = "Immediate Escalation & Account Manager Outreach"
    elif prob_late > 0.35:
        tier = "MEDIUM"
        action = "Automated Smart Reminder with Dynamic Discount Link"
    else:
        tier = "LOW"
        action = "Standard Courteous Email Reminder"
        
    return {
        "probability_late": round(prob_late, 3),
        "risk_tier": tier,
        "recommended_action": action,
        "explainability": {
            "top_risk_driver": "High DSO relative to industry standard" if payload["dso"] > 45 else "Historical late payment pattern",
            "confidence": f"{round(max(prob_late, 1 - prob_late) * 100, 1)}%"
        }
    }