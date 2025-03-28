from pdf_extractor import extract_text_from_pdf
from ai_resume_enhancement import enhance_resume
from ai_candidate_search import search_candidates
from ai_job_matching import match_jobs

if __name__ == "__main__":
    # Step 1: Extract text from uploaded PDF
    pdf_file = r"D:\CV.pdf"  # Change this to the actual uploaded PDF file
    resume_text = extract_text_from_pdf(pdf_file)
    print("\nExtracted Resume Text:\n", resume_text)

    # Step 2: Enhance Resume (Fix grammar & extract keywords)
    corrected_text, keywords = enhance_resume(resume_text)
    print("\nEnhanced Resume:", corrected_text)
    print("Extracted Keywords:", keywords)

    # Step 3: Job Matching AI - Find best jobs for the candidate
    job_descriptions = ["Looking for a Python developer with AI experience."]
    resumes = [corrected_text]  # Use enhanced resume text
    job_results = match_jobs(resumes, job_descriptions)

    # Step 4: Print best job matches
    print("\nBest Job Matches:")
    for res, score in job_results:
        print(f"- {res} (Match Score: {score:.2f})")

    # Step 5: Candidate Search AI (if needed)
    candidates = ["AI Engineer skilled in Python", "Frontend Developer", "Data Scientist with Python"]
    candidate_results = search_candidates(job_descriptions[0], candidates)

    print("\nCandidate Matches:")
    for cand, score in candidate_results:
        print(f"- {cand} (Similarity: {score:.2f})")
