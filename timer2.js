from utils import configure_logging, Hierarchy, HierarchyFeed, FortInputFeedLog, Configurations
from datetime import datetime

logger = configure_logging("default_hierarchy")

def main() -> None:
    # Initialize API and logging
    hierarchy_api = Hierarchy()
    fortInputFeedLog = FortInputFeedLog()

    # Get current snapshot details
    config = Configurations()
    snap_details = config.get_current_snap()

    # Check if hierarchy snaps are present
    sds_region = (snap_details["sds_hierarchy_snaps"] if "sds_hierarchy_snaps" in snap_details else None)
    sds_snap_date = snap_details["snap_date"] if "snap_date" in snap_details else None

    if not sds_snap_date:
        logger.info("Snap date is not provided.")
        return

    logger.info(f"Region provided is {sds_region}")
    logger.info(f"Snap date provided is {sds_snap_date}")

    # Format the date
    cob_log = datetime.strptime(sds_snap_date, "%Y-%m-%d").strftime("%d-%b-%y")

    # Check API response
    try:
        all_hierarchy_data = hierarchy_api.get_all_active()
        P_STATUS = "AVAILABLE"
        P_LOAD_MESSAGE = f"Hierarchy snaps for {cob_log} are available"
    except Exception as e:
        if "400" in str(e):  # API returned status code 400
            P_STATUS = "NOT AVAILABLE"
            P_LOAD_MESSAGE = f"Hierarchy snaps for {cob_log} are not available"
        else:
            raise  # Re-raise other exceptions

    # Log the result
    fortInputFeedLog.add_log(
        P_FILE_TYPE="SDS_APACLOSE_testdevraj",
        P_STATUS=P_STATUS,
        P_LOAD_MESSAGE=P_LOAD_MESSAGE,
        P_COB_DATE=cob_log
    )

if __name__ == "__main__":
    main()