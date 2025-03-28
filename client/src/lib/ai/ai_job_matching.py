from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def match_jobs(resumes, job_descriptions):
    """
    Matches resumes with job descriptions using TF-IDF and Cosine Similarity.
    """

    # Improved TF-IDF vectorizer with fine-tuning
    vectorizer = TfidfVectorizer(
        stop_words='english',   # Removes common words
        ngram_range=(1, 2),     # Considers bigrams (e.g., "machine learning" as a single feature)
        sublinear_tf=True,      # Adjusts term frequency impact
        smooth_idf=True         # Prevents zero division errors for rare words
    )

    # Convert text into numerical vectors
    resume_vectors = vectorizer.fit_transform(resumes)
    job_vectors = vectorizer.transform(job_descriptions)

    # Compute cosine similarity
    similarities = cosine_similarity(job_vectors, resume_vectors)

    # Sort results by best match
    sorted_matches = sorted(zip(resumes, similarities[0]), key=lambda x: x[1], reverse=True)
    return sorted_matches
