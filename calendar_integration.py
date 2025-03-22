# calendar_integration.py
import datetime
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/calendar']


def get_calendar_service():
    """
    Returns an authorized Google Calendar service instance.
    """
    creds_file = os.getenv("GOOGLE_CALENDAR_CREDENTIALS_FILE")
    if not creds_file:
        raise EnvironmentError("GOOGLE_CALENDAR_CREDENTIALS_FILE environment variable is not set.")
    creds = service_account.Credentials.from_service_account_file(creds_file, scopes=SCOPES)
    service = build('calendar', 'v3', credentials=creds)
    return service


def add_event(event_info: dict):
    """
    Creates a calendar event using the provided event_info dictionary which contains
    'event' (summary) and 'date' (in MM/DD/YYYY format).
    Returns the created event, or None on failure.  Includes more robust error handling.
    """
    service = get_calendar_service()

    try:
        event_date = datetime.datetime.strptime(event_info["date"], "%m/%d/%Y").date()
    except ValueError:
        print(
            f"Date format not recognized for '{event_info['date']}' in event '{event_info['event']}'. Skipping."
        )
        return None

    event = {
        'summary': event_info["event"],
        'start': {
            'date': event_date.isoformat(),
        },
        'end': {
            'date': (event_date + datetime.timedelta(days=1)).isoformat(),
        },
    }

    try:
        calendar_id = os.getenv("CALENDAR_ID")
        if not calendar_id:
            raise EnvironmentError("CALENDAR_ID environment variable is not set.")
        created_event = service.events().insert(calendarId=calendar_id, body=event).execute()
        return created_event
    except Exception as e:
        print(f"Failed to add event '{event_info['event']}' on {event_info['date']}: {e}")
        return None


def add_events(events: list) -> list:
    """
    Given a list of event dictionaries, adds each event to the calendar.
    Returns a list of successfully added events.
    """
    added_events = []
    for event_info in events:
        created = add_event(event_info)
        if created:
            added_events.append(created)
    return added_events