import logging
from typing import Dict

# Assuming Custom_Api and Configurations are available in your project structure
from utils.api import Custom_Api
from utils.configuration import Configurations

# Set up logger
logger = logging.getLogger(__name__)

class System(Custom_Api):
    def __init__(self):
        # Initialize configurations and necessary attributes
        self.__book_snap_key_name = "sds_book_snaps"
        super().__init__(self, self.__book_snap_key_name)  # Inheriting from Custom_Api
        self.__system_fields = self.read_json("system.json")  # Assumes this reads a JSON file for fields
        self.__system_id_field = self.read_json("book_id.json")
        self.__system_url = self.base_url + "system/"

    def __common_config(self, fields) -> Dict[str, any]:
        # Define common configuration settings
        take = 3000
        snap = {
            "CloseofBusiness": self.business_close,
            "date": self.business_close_date,
        }
        common_configuration = {"take": take, "fields": fields, "snap": snap}
        return common_configuration

    def __criteria_for_all_systems(self):
        # Define criteria for fetching all systems
        criteria = {
            "operator": "and",
            "items": [
                {"operator": "gte", "field": "id", "value": 0},
            ],
        }
        return criteria

    def get_all_active_count(self):
        # Get count of all active systems
        system_url = self.__system_url + "count"
        criteria = self.__criteria_for_all_systems()
        headers = {"Content-Type": "application/json"}
        common_config = self.__common_config(fields=self.__system_id_field)

        return self.run(
            request_type="post",
            url=system_url,
            criteria=criteria,
            after_id=0,
            take=common_config["take"],
            fields=common_config["fields"],
            headers=headers,
            snap=common_config["snap"],
            logger_message="Starting the process of fetching all systems from SDS."
        )

    def get_all_active(self):
        # Fetch all active systems
        system_url = self.__system_url + "find"
        criteria = self.__criteria_for_all_systems()
        headers = {"Content-Type": "application/json"}
        common_config = self.__common_config(fields=self.__system_fields)

        output = self.run(
            request_type="post",
            url=system_url,
            criteria=criteria,
            after_id=0,
            take=common_config["take"],
            fields=common_config["fields"],
            headers=headers,
            snap=common_config["snap"],
            logger_message="Starting the process of fetching all active systems."
        )
        return output
