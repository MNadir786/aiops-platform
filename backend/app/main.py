from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/predict")
def predict():
    # placeholder for AI logic
    return {"prediction": "Low risk"}
