from typing import List, Dict
from utils.configuration.configuration import Configurations
from utils.feed.feed import Feed
from re import sub

class HierarchyLevelFeed(Feed):
    def __init__(self):
        super().__init__()
        config = Configurations()
        self._sds_hierarchy_feed_attributes_config = config.get_sds_hierarchylevel_attributes()

    def _hierarchy_feed_content(self, hierarchy_data: List[Dict[str, any]], feed_name: str):
        if "attributes" not in self._sds_hierarchy_feed_attributes_config:
            raise Exception("Did not find attributes to create Hierarchy feed.")

        headers = self._sds_hierarchy_feed_attributes_config["attributes"]
        headers = sub(r"[\n\t\s]+", "", headers).split(",")
        
        # Create a dictionary to hold the hierarchy columns dynamically
        column_headers = []
        for hierarchy_level in [
            "Level 10",
            "Level 9",
            "Level 8",
            "Level 7",
            "Level 6",
            "Subproduct",
            "Business Area",
            "Product Area",
            "Company",
            "Group",
        ]:
            column_headers.append(f"{hierarchy_level} ID")
            column_headers.append(f"{hierarchy_level} Name")

        # Prepare output rows
        hierarchy_feed_outputs = []
        for hierarchy in hierarchy_data:
            curr_hierarchy_info = {header: None for header in column_headers}

            # Populate columns dynamically
            for header in headers:
                hierarchy_type = hierarchy.get("type", "")
                if hierarchy_type:
                    curr_hierarchy_info[f"{hierarchy_type} ID"] = str(hierarchy["id"]) if "id" in hierarchy else None
                    curr_hierarchy_info[f"{hierarchy_type} Name"] = str(hierarchy["name"]) if "name" in hierarchy else None

            hierarchy_feed_outputs.append(curr_hierarchy_info)

        # Return feed with headers and hierarchy information
        return self._create_feed_file(column_headers, hierarchy_feed_outputs, feed_name)

    def feed(self, hierarchy_data):
        feed_name = self._feed_name(sds_entity="hierarchylevel_feed", is_json=False)
        feed_file_content = self._hierarchy_feed_content(hierarchy_data, feed_name)
        self._save(feed_name, content=feed_file_content)
        return feed_name