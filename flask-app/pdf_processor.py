import google.generativeai as genai
import os
from dotenv import load_dotenv
import PyPDF2  # Import PyPDF2
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()


def extract_due_dates(pdf_path: str) -> list:
    """
    Reads a local PDF file (assumed to be a syllabus), sends it to Google Gemini to extract all
    items that have due dates (assignments, quizzes, midterms, exams, in-class assignments), and
    returns a list of dictionaries with keys 'event' and 'date'.
    """
    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)  # Use PyPDF2 to read the PDF
            text = ""
            for page in reader.pages:  # Iterate through pages correctly
                text += page.extract_text() or ""  # Extract text, handle None
            if not text.strip():  # Check for empty text
                print(f"Error: No text found in PDF file: {pdf_path}")
                return []
    except Exception as e:
        print(f"Error reading PDF file: {e}")
        return []

    # Initialize Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError("GEMINI_API_KEY environment variable is not set.")
    genai.configure(api_key=api_key)

    prompt = (
        "Extract all items with due dates from the following syllabus text. "
        "Include assignments, quizzes, midterms, exams, and in-class assignments. "
        "For each item, provide the event name and its due date. "
        "If a due date is a specific date, use the format 'Event Name - MM/DD/YYYY'. "
        "If a due date is given as 'Week of MM/DD/YYYY', use the *first day* of that week (Monday) as the date. "
        "For example, 'Week of 09/16/2024' should be converted to '09/16/2024'. "
        "If you cannot find a specific date or 'Week of' date, do not include that event. "
        "Return the results as a comma-separated list of 'Event Name - MM/DD/YYYY' entries. "
        "If no events are found, return an empty string."
    )

    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content([text, prompt])  # Pass the extracted text
        result = response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return []

    if not result:
        return []

    events = []
    entries = result.split(",")
    for entry in entries:
        if "-" in entry:
            parts = entry.split("-")
            event_name = parts[0].strip()
            date_str = parts[1].strip()
            if event_name and date_str:
                try:
                    # Attempt to parse the date
                    datetime.strptime(date_str, "%m/%d/%Y")
                    events.append({"event": event_name, "date": date_str})
                except ValueError:
                    print(f"Skipping event '{event_name}' with unparseable date: {date_str}")
                    pass  # Skip if the date doesn't match the expected format
    return events
