from fastapi import Request
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
svc_model = joblib.load("svc_model.pkl")
nb_model = joblib.load("nb_model.pkl")
rfc_model = joblib.load("rfc_model.pkl")
log_model = joblib.load("logistic_regression.pkl")
tfidf = joblib.load("tfidf_vectorizer.pkl")

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

@app.post("/validate")
@app.post("/validate")
def validate(req: IssueRequest):

    combined_text = preprocess(req.title + " " + req.description)
    X = tfidf.transform([combined_text])

    svc = int(svc_model.predict(X)[0])
    nb = int(nb_model.predict(X)[0])
    rfc = int(rfc_model.predict(X)[0])
    log = int(log_model.predict(X)[0])

    votes = [svc, nb, rfc, log]

    final = max(set(votes), key=votes.count)

    return {
        "valid": final == 1,
        "final_prediction": int(final),
        "model_votes": votes
    }

@app.get("/")
def home():
    return {"status": "ML service running"}