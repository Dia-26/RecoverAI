import joblib
from pathlib import Path

ARTIFACTS_DIR = Path(__file__).parent.parent.parent / "artifacts" / "checkout"

checkout_model = joblib.load(ARTIFACTS_DIR / "checkout_model.pkl")
checkout_scaler = joblib.load(ARTIFACTS_DIR / "checkout_scaler.pkl")

def evaluate_cart_session(payload: dict):
    features = [[
        payload["cart_value"],
        payload["session_duration_mins"],
        payload["items_count"],
        payload["past_orders"],
        payload["exit_step"]
    ]]
    
    scaled = checkout_scaler.transform(features)
    prob_convert = float(checkout_model.predict_proba(scaled)[0][1])
    
    if prob_convert < 0.25:
        nudge = "Hold Margin (No discount, send reminder only)"
    elif prob_convert < 0.65:
        nudge = "Send 5% Personalized Promo Code via WhatsApp"
    else:
        nudge = "Send Stock Urgency Notice (No margin burn)"
        
    return {
        "conversion_probability": round(prob_convert, 3),
        "nudge_action": nudge
    }