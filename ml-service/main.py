import os
import nltk
import joblib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import uvicorn

# --------------------------------------------------
# Load NLTK data
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

nltk.data.path.append(os.path.join(BASE_DIR, "nltk_data"))

# --------------------------------------------------
# FastAPI
# --------------------------------------------------

app = FastAPI(
    title="ML Validation Service",
    version="1.0.0"
)

# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Load Models
# --------------------------------------------------

svc_model = joblib.load(os.path.join(BASE_DIR, "svc_model.pkl"))
nb_model = joblib.load(os.path.join(BASE_DIR, "nb_model.pkl"))
rfc_model = joblib.load(os.path.join(BASE_DIR, "rfc_model.pkl"))
log_model = joblib.load(os.path.join(BASE_DIR, "logistic_regression.pkl"))
tfidf = joblib.load(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))

# --------------------------------------------------
# NLP
# --------------------------------------------------

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

# --------------------------------------------------
# Request Schema
# --------------------------------------------------

class IssueRequest(BaseModel):
    title: str
    description: str

# --------------------------------------------------
# Preprocessing
# --------------------------------------------------

def preprocess(text: str):

    text = text.lower()

    tokens = word_tokenize(text)

    tokens = [
        token
        for token in tokens
        if token.isalpha() and token not in stop_words
    ]

    tokens = [
        lemmatizer.lemmatize(token)
        for token in tokens
    ]

    return " ".join(tokens)

# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "status": "running",
        "service": "ML Validation API"
    }

# --------------------------------------------------
# Validation Endpoint
# --------------------------------------------------

@app.post("/validate")
def validate(req: IssueRequest):

    combined_text = preprocess(
        req.title + " " + req.description
    )

    X = tfidf.transform([combined_text])

    svc = int(svc_model.predict(X)[0])
    nb = int(nb_model.predict(X)[0])
    rfc = int(rfc_model.predict(X)[0])
    log = int(log_model.predict(X)[0])

    votes = [svc, nb, rfc, log]

    positive = votes.count(1)
    negative = votes.count(0)

    final_prediction = 1 if positive >= negative else 0

    return {
        "valid": bool(final_prediction),
        "prediction": final_prediction,
        "votes": {
            "svc": svc,
            "naive_bayes": nb,
            "random_forest": rfc,
            "logistic_regression": log,
        }
    }

# --------------------------------------------------
# Railway Entry
# --------------------------------------------------

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
    )