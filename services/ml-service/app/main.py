from fastapi import FastAPI
from pydantic import BaseModel

from .model import predict_risk

app = FastAPI(title="MuleGuard ML Service")


class TransactionFeatures(BaseModel):
    transaction_count: float
    total_amount: float
    avg_amount: float
    max_amount: float
    unique_counterparties: float


@app.get("/health")
def health():
    return {
        "service": "MuleGuard ML Service",
        "status": "running"
    }


@app.post("/predict")
def predict(data: TransactionFeatures):
    values = [
        data.transaction_count,
        data.total_amount,
        data.avg_amount,
        data.max_amount,
        data.unique_counterparties
    ]

    return predict_risk(values)