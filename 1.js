import logging
from typing import Dict, List
from datetime import datetime, timedelta

from utils.api import Custom_Api
from utils.configuration import Configurations
from utils.custom_packages import get_chunk

# Set up logger
logger = logging.getLogger(__name__)

class System(Custom_Api):
    def __init__(self):
        # Set the snap key name and initialize the parent class
        self.__system_snap_key_name = "sds_system_snaps"
        super().__init__(self.__system_snap_key_name)  # Initialize Custom_Api with the snap key name

        # Load JSON configurations for system fields
        self.__system_fields = self.read_json("system.json")
        self.__system_id_field = self.read_json("book_id.json")
        
        # Define the base URL for system requests
        self.__system_url = self.base_url + "system/"

    def __common_config(self, fields, deleted=False) -> Dict[str, any]:
        # Check if fields is a list
        if not isinstance(fields, list):
            message = "Fields are supposed to be an array of strings."
            logger.exception(message)
            raise Exception(message)
        
        # Common request configuration
        take = 1200
        snap = {
            "CloseofBusiness": self.business_close,
            "date": self.business_close_date,
        }
        common_configuration = {"take": take, "fields": fields, "snap": snap}
        
        if deleted:
            common_configuration["deleted"] = True
        
        logger.info(f"Common configuration: {common_configuration}")
        return common_configuration

    def __criteria_for_all_systems(self):
        # Define criteria for fetching all systems
        criteria = {
            "operator": "and",
            "items": [
                {"operator": "gte", "field": "id", "value": 0},
                {"operator": "ne", "field": "non_standard_category", "value": "C"},
            ],
        }
        return criteria

    def get_all_active_count(self):
        # Get the count of all active systems
        request_type = "post"
        system_url = self.__system_url + "count"
        criteria = self.__criteria_for_all_systems()
        headers = {"Content-Type": "application/json"}
        common_config = self.__common_config(fields=self.__system_id_field)

        return self.run(
            request_type=request_type,
            url=system_url,
            criteria=criteria,
            after_id=0,
            take=common_config["take"],
            fields=common_config["fields"],
            headers=headers,
            snap=common_config["snap"],
            logger_message="Starting the process of fetching all systems count from SDS."
        )

    def get_all_active(self):
        # Fetch all active systems
        request_type = "post"
        system_url = self.__system_url + "find"
        criteria = self.__criteria_for_all_systems()
        headers = {"Content-Type": "application/json"}
        common_config = self.__common_config(fields=self.__system_fields)

        output = self.run(
            request_type=request_type,
            url=system_url,
            criteria=criteria,
            after_id=0,
            take=common_config["take"],
            fields=common_config["fields"],
            headers=headers,
            snap=common_config["snap"],
            logger_message="Starting the process of fetching all active systems from SDS."
        )
        return output

    def get_all_deleted(self):
        # Fetch all deleted systems
        request_type = "post"
        system_url = self.__system_url + "find-deleted"
        criteria = self.__criteria_for_all_systems()
        headers = {"Content-Type": "application/json"}
        common_config = self.__common_config(fields=self.__system_fields, deleted=True)

        output = self.run(
            request_type=request_type,
            url=system_url,
            criteria=criteria,
            after_id=0,
            take=common_config["take"],
            fields=common_config["fields"],
            headers=headers,
            snap=common_config["snap"],
            logger_message="Starting the process of fetching all deleted systems from SDS."
        )
        return output