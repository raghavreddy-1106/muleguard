from fastapi import FastAPI
from pydantic import BaseModel

from .analysis import analyze_network

app = FastAPI(title="MuleGuard AML Service")


class Transaction(BaseModel):
    account_id: int
    counterparty_account_id: int
    amount: float


class NetworkRequest(BaseModel):
    transactions: list[Transaction]


@app.get("/health")
def health():
    return {
        "service": "MuleGuard AML Service",
        "status": "running"
    }


@app.post("/analyze")
def analyze(data: NetworkRequest):
    transactions = [tx.model_dump() for tx in data.transactions]
    return analyze_network(transactions)