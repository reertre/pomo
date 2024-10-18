# book.py

from api.book import Book  # Ensure this path is correct
from utils.custom_packages import dumps  # Assuming you have this utility
import logging
from typing import List, Dict
from datetime import datetime

def configure_logging(name: str):
    # Your existing logging setup
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    return logger

class Configurations:
    def get_snap(self):
        # Placeholder for your actual implementation
        return {
            "business_close": "2024-10-17T18:00:00Z",
            "date": "2024-10-17"
        }

def main():
    try:
        # Set up logging
        logging = configure_logging("book")
        logging.debug("Started the book.py code")

        # Initialize required objects
        config = Configurations()

        # Get snapshot details
        snap_details = config.get_snap()
        sds_region = snap_details["business_close"] if "business_close" in snap_details else None
        sds_snap_date = snap_details["date"] if "date" in snap_details else None

        logging.debug(f"REGION PROVIDED: {sds_region}")
        logging.debug(f"SNAP DATE PROVIDED: {sds_snap_date}")

        # Instantiate the Book object
        book = Book(sds_region, sds_snap_date)

        # Get and print the total number of books
        total_books = book.get_all_active_count()  # Assuming this method exists
        print(f"Total number of books: {total_books}")

        # Example for fetching delta changes
        from_time = datetime.strptime("2024-10-01T00:00:00Z", "%Y-%m-%dT%H:%M:%SZ")
        till_time = datetime.strptime("2024-10-17T23:59:59Z", "%Y-%m-%dT%H:%M:%SZ")

        delta_books: List[Dict[str, any]] = book.get_delta_changes(from_time, till_time, False)

        # Process delta books
        delta_ids: List[int] = []
        for book in delta_books:
            if "id" in book:
                delta_ids.append(book["id"])

        # Log and process delta IDs
        delta_ids_json = dumps(delta_ids)
        logging.info(f"Delta IDs fetched from SDS are:\n{delta_ids_json}")

    except Exception as e:
        logging.exception(f"Error occurred: {e}")
        raise

if __name__ == "__main__":
    main()
