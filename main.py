# main.py
import sys
from pdf_processor import extract_due_dates
from calendar_integration import add_events


def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py path/to/syllabus.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]

    print(f"Processing PDF file: {pdf_path}")
    events = extract_due_dates(pdf_path)

    if not events:
        print("No due-date events found in the syllabus.")
        sys.exit(0)

    print("Due-date events extracted:")
    for event in events:
        print(f" - {event['event']} on {event['date']}")

    print("\nAdding events to Google Calendar...")
    created_events = add_events(events)

    if created_events:
        print("Successfully added the following events:")
        for event in created_events:
            start = event.get('start')
            if start:
                date_str = start.get('date')
                summary = event.get('summary')
                print(f" - Event '{summary}' on {date_str}")
            else:
                print(f" - Event details missing 'start' date.")
    else:
        print("No events were added to the calendar.")


if __name__ == "__main__":
    main()
