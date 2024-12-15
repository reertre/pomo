from utils import configure_logging, Hierarchy, HierarchyFeed, FortInputFeedLog, Configurations
from datetime import datetime

logger = configure_logging("default_hierarchy")

def main() -> None:
    hierarchy_api = Hierarchy()
    fortInputFeedLog = FortInputFeedLog()

    config = Configurations()
    snap_details = config.get_current_snap()
    sds_region = snap_details["sds_hierarchy_snaps"] if "sds_hierarchy_snaps" in snap_details else None
    sds_snap_date = snap_details["snap_date"] if "snap_date" in snap_details else None

    logger.info(f"Region provided is {sds_region}")
    logger.info(f"Snap date provided is {sds_snap_date}")

    file_type_log = sds_region.upper()
    cob_log = datetime.strptime(sds_snap_date, "%Y-%m-%d").strftime("%d-%b-%y")

    # Initial status log
    P_STATUS = "CHECKING"
    fortInputFeedLog.add_log(
        P_FILE_TYPE=f"SDS_{file_type_log}_testdevraj",
        P_STATUS=P_STATUS,
        P_LOAD_MESSAGE=f"test_devraj Hierarchy snaps for {P_STATUS} for {file_type_log} region for cob date - {cob_log}",
        P_COB_DATE=cob_log,
    )

    # Fetch hierarchy data
    response = hierarchy_api.get_all_active()
    if isinstance(response, dict) and "status_code" in response and response["status_code"] == 400:
        # Handle specific API response for 400 status code
        logger.error("The snaps for this date are not available")
        P_STATUS = "NOT AVAILABLE"
    elif response:  # If response has valid data
        P_STATUS = "AVAILABLE"
    else:  # Handle all other cases
        logger.error("Unexpected response or no data returned")
        P_STATUS = "NOT AVAILABLE"

    # Log the final status
    fortInputFeedLog.add_log(
        P_FILE_TYPE=f"SDS_{file_type_log}_testdevraj",
        P_STATUS=P_STATUS,
        P_LOAD_MESSAGE=f"test_devraj Hierarchy snaps for {P_STATUS} for {file_type_log} region for cob date - {cob_log}",
        P_COB_DATE=cob_log,
    )

    # If data is available, proceed with feed creation
    if P_STATUS == "AVAILABLE":
        hierarchy_feed = HierarchyFeed()
        hierarchy_feed_name = hierarchy_feed.feed(response)
        print(hierarchy_feed_name)

if __name__ == "__main__":
    main()