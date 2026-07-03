import nltk

packages = [
    "punkt",
    "punkt_tab",
    "stopwords",
    "wordnet"
]

for package in packages:
    nltk.download(package)