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
# FASTAPI APP
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
# NLTK SAFE INITIALIZATION
# -----------------------------
def setup_nltk():
    resources = [
        "punkt",
        "punkt_tab",
        "stopwords",
        "wordnet"
    ]

    for r in resources:
        try:
            nltk.data.find(r)
        except LookupError:
            nltk.download(r)


setup_nltk()

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()


# -----------------------------
# LOAD MODELS (SAFE PATH)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

svc_model = joblib.load(os.path.join(BASE_DIR, "svc_model.pkl"))
nb_model = joblib.load(os.path.join(BASE_DIR, "nb_model.pkl"))
rfc_model = joblib.load(os.path.join(BASE_DIR, "rfc_model.pkl"))
log_model = joblib.load(os.path.join(BASE_DIR, "logistic_regression.pkl"))
tfidf = joblib.load(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))


# -----------------------------
# REQUEST SCHEMA
# -----------------------------
class IssueRequest(BaseModel):
    title: str
    description: str


# -----------------------------
# PREPROCESS FUNCTION (NLTK BASED)
# -----------------------------
def preprocess(text: str):
    text = text.lower()

    tokens = word_tokenize(text)

    cleaned = []
    for w in tokens:
        if w.isalpha() and w not in stop_words:
            cleaned.append(w)

    lemmatized = [lemmatizer.lemmatize(w) for w in cleaned]

    return " ".join(lemmatized)


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def home():
    return {"status": "ML service running"}


# -----------------------------
# VALIDATE ENDPOINT
# -----------------------------
@app.post("/validate")
def validate(req: IssueRequest):

    combined_text = preprocess(req.title + " " + req.description)
    X = tfidf.transform([combined_text])

    nb = int(nb_model.predict(X)[0])
    rfc = int(rfc_model.predict(X)[0])
    log = int(log_model.predict(X)[0])
    
    votes = [nb, rfc, log]
    final = 1 if votes.count(1) >= votes.count(0) else 0

    return {
        "valid": bool(final),
        "prediction": final,
        "votes": {
            "naive_bayes": nb,
            "random_forest": rfc,
            "logistic_regression": log
        }
    }
