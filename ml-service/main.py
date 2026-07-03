import os
import nltk
import joblib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# -----------------------------
# Ensure NLTK downloads ONCE at runtime
# -----------------------------
def safe_nltk_download():
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt")

    try:
        nltk.data.find("corpora/stopwords")
    except LookupError:
        nltk.download("stopwords")

    try:
        nltk.data.find("corpora/wordnet")
    except LookupError:
        nltk.download("wordnet")


safe_nltk_download()

# -----------------------------
# FastAPI setup
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load models
# -----------------------------
svc_model = joblib.load("svc_model.pkl")
nb_model = joblib.load("nb_model.pkl")
rfc_model = joblib.load("rfc_model.pkl")
log_model = joblib.load("logistic_regression.pkl")
tfidf = joblib.load("tfidf_vectorizer.pkl")

# -----------------------------
# NLP tools
# -----------------------------
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

class IssueRequest(BaseModel):
    title: str
    description: str

def preprocess(text: str):
    text = text.lower()
    tokens = word_tokenize(text)

    cleaned = []
    for w in tokens:
        if w.isalpha() and w not in stop_words:
            cleaned.append(w)

    lemmas = [lemmatizer.lemmatize(w) for w in cleaned]
    return " ".join(lemmas)

@app.get("/")
def home():
    return {"status": "ML service running"}

@app.post("/validate")
def validate(req: IssueRequest):

    combined_text = preprocess(req.title + " " + req.description)
    X = tfidf.transform([combined_text])

    svc = int(svc_model.predict(X)[0])
    nb = int(nb_model.predict(X)[0])
    rfc = int(rfc_model.predict(X)[0])
    log = int(log_model.predict(X)[0])

    votes = [svc, nb, rfc, log]
    final = 1 if votes.count(1) >= votes.count(0) else 0

    return {
        "valid": bool(final),
        "prediction": final,
        "votes": {
            "svc": svc,
            "naive_bayes": nb,
            "random_forest": rfc,
            "logistic_regression": log
        }
    }
