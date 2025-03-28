import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF resume.
    """
    text = ""
    doc = fitz.open(pdf_path)  # Open PDF file
    for page in doc:  # Loop through each page
        text += page.get_text("text") + "\n"  # Extract text
    return text.strip()

# Example usage (for testing)
if __name__ == "__main__":
    pdf_file = "sample_resume.pdf"  # Change this to an actual PDF file
    resume_text = extract_text_from_pdf(r"D:\CV.pdf")
    print(resume_text)
