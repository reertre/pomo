from utils import configure_logging, System, SystemFeed, AliasFeed, FortInputFeedLog, Configurations
from datetime import datetime
logger = configure_logging("default_system")

def main() -> None:
    system_api = System()
    fortInputFeedLog = FortInputFeedLog()
    
    # Check all system data
    all_system_data = system_api.get_all_active()
    system_feed = SystemFeed()
    alias_feed = AliasFeed()

    # Generate feeds
    system_feed_name = system_feed.feed(all_system_data)
    alias_feed_name = alias_feed.feed(all_system_data)
    
    # Fetch configuration details
    config = Configurations()
    snap_details = config.get_current_snap()
    
    sds_region = (snap_details["sds_system_snaps"] if "sds_system_snaps" in snap_details else None)
    sds_snap_date = snap_details["snap_date"] if "snap_date" in snap_details else None
    
    if not sds_snap_date:  # No snap date provided
        logger.warning("No snap date provided. Unable to check snap status.")
        P_STATUS = "Unavailable"
    else:
        logger.info(f"Region provided is {sds_region}")
        logger.info(f"Snap date provided is {sds_snap_date}")

        file_type_log = sds_region.upper()
        cob_log = datetime.strptime(sds_snap_date, "%Y-%m-%d").strftime("%d-%b-%Y")
        
        # Check snap availability for the given date
        try:
            # Replace this with your API call for checking snaps by date
            all_snaps = system_api.get_all_active()  # Simulating API call
            if all_snaps:
                P_STATUS = "Available"
            else:
                P_STATUS = "Unavailable"
        except Exception as e:
            logger.error(f"Error while checking snaps for {sds_snap_date}: {e}")
            P_STATUS = "Unavailable"
    
    # Add log
    fortInputFeedLog.add_log(
        P_FILE_TYPE=f"SDS ({file_type_log})",
        P_STATUS=P_STATUS,
        P_LOAD_MESSAGE=f"Checking System snaps for {file_type_log} region for cob date - {cob_log}",
        P_COB_DATE=cob_log,
    )
    
    print(alias_feed_name)
    print(system_feed_name)

if __name__ == "__main__":
    main()