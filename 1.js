def main():
    try:
        logging = configure_logging("book")
        logging.debug("Started the book.py code")

        tdbHistSystemLog = TdbHistSystemLog()
        config = Configurations()

        snap_details = config.get_snap()

        sds_region = snap_details["business_close"] if "business_close" in snap_details else None
        sds_snap_date = snap_details["date"] if "date" in snap_details else None

        till_time = snap_details["sla_to"] if "sla_to" in snap_details else None

        file_type_log = sds_region.upper()
        cob_log = datetime.strptime(sds_snap_date, "%Y-%m-%d").strftime("%d-%b-%Y")

        logging.debug(f"REGION PROVIDED = {sds_region}")
        logging.debug(f"SNAP DATE PROVIDED = {sds_snap_date}")
        logging.debug(f"START TIME PROVIDED = {from_time}")
        logging.debug(f"TILL TIME PROVIDED = {till_time}")

        # Instantiate the Book class
        book = Book(sds_region, sds_snap_date)

        # PRINTING THE TOTAL NUMBER OF BOOKS
        total_books = book.get_all_active_count()
        print(f"Total number of books: {total_books}")
        logging.debug(f"Total number of books: {total_books}")

        # Fetching delta changes as per the original code
        delta_books: List[Dict[str, any]] = book.get_delta_changes(from_time, till_time, False)

        delta_ids: List[int] = list()

        for book in delta_books:
            if "id" in book:
                delta_ids.append(book["id"])

        delta_ids_json = dumps(delta_ids)
        logging.info(f"Delta ID's fetched from SDS is:\n{delta_ids_json}")

        delta_master_book_id_feed = DeltaMasterBookId()
        delta_master_book_feed_name = delta_master_book_id_feed.feed(
            delta_ids_json=delta_ids_json
        )

        config.update_delta_info(
            attribute="delta_master_book_feed_name", value=delta_master_book_feed_name
        )

        tdbHistSystemLog.add_log(
            source_data_set=delta_master_book_feed_name,
            program_name=f"SDS ({file_type_log}) DELTA MASTER BOOK IDS",
            message=f"Successfully fetched {len(delta_ids)} delta master book ids",
            cob=cob_log,
        )
        tdbHistSystemLog.close()

    except Exception as e:
        file_type_log = file_type_log if "file_type_log" in locals() else "NOREGION"
        cob_log = cob_log if "cob_log" in locals() else datetime.today().strftime("%d-%b-%Y")
        tdbHistSystemLog.add_log(
            source_data_set=f"SDS ({file_type_log}) DELTA_BOOK",
            program_name=f"SDS ({file_type_log}) DELTA_BOOK",
            message=f"Error: {e}",
            cob=cob_log,
        )
        tdbHistSystemLog.close()
        raise Exception(e)


if __name__ == "__main__":
    main()
