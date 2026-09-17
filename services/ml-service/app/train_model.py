from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BASE_DIR.parents[1]

DATA_FILE = PROJECT_DIR / "data" / "processed" / "ml_features.csv"
MODEL_FILE = BASE_DIR / "models" / "risk_model.joblib"


df = pd.read_csv(DATA_FILE)

features = [
    "transaction_count",
    "total_amount",
    "avg_amount",
    "max_amount",
    "unique_counterparties"
]

X = df[features]
y = df["isFraud"].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(
    n_estimators=100,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, predictions, zero_division=0))

print("Confusion Matrix:")
print(confusion_matrix(y_test, predictions))

joblib.dump(
    {
        "model": model,
        "features": features
    },
    MODEL_FILE
)

print(f"\nModel saved to: {MODEL_FILE}")
