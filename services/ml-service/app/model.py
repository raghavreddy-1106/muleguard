from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_FILE = BASE_DIR / "models" / "risk_model.joblib"

data = joblib.load(MODEL_FILE)

model = data["model"]
features = data["features"]


def predict_risk(values):
    prediction = model.predict_proba([values])[0][1]

    if prediction >= 0.70:
        level = "HIGH"
    elif prediction >= 0.40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_score": round(float(prediction), 4),
        "risk_level": level
    }