from fastapi import FastAPI

app = FastAPI(title="MuleGuard ML Service")


@app.get("/health")
def health():
    return {
        "service": "MuleGuard ML Service",
        "status": "running"
    }