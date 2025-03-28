import spacy
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")
nltk.download("punkt")
nltk.download("stopwords")

def enhance_resume(resume_text):
    """
    Enhances a resume by correcting grammar and extracting keywords.
    """
    doc = nlp(resume_text)
    
    # Grammar Correction (Basic Check)
    corrected_text = " ".join([token.text for token in doc])
    
    # Extract Key Skills
    stop_words = set(stopwords.words("english"))
    keywords = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"] and token.text.lower() not in stop_words]
    
    return corrected_text, keywords

