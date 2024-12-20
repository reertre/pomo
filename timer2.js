from utils.configuration.configuration import Configurations
from utils.feed.feed import Feed

from re import sub
from typing import List, Dict
from collections import defaultdict

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

        # Define hierarchy levels and their renamed headers
        hierarchy_levels = {
            "Level 10": "Hierarchy10",
            "Level 9": "Hierarchy9",
            "Level 8": "Hierarchy8",
            "Level 7": "Hierarchy7",
            "Level 6": "Hierarchy6",
            "Subproduct": "Subproduct",
            "Business Area": "BusinessArea",
            "Product Area": "ProductArea",
            "Company": "Company",
            "Group": "Group",
        }

        # Generate column headers dynamically
        column_headers = []
        for level, renamed_level in hierarchy_levels.items():
            column_headers.append(f"{renamed_level} ID")
            column_headers.append(f"{renamed_level} Name")

        # Preprocess hierarchy data into a hash map (dictionary) for efficient lookups
        hierarchy_dict = defaultdict(list)
        for item in hierarchy_data:
            hierarchy_dict[item["type"]].append(item)

        # Prepare output rows
        hierarchy_feed_outputs = []
        max_length = max(len(hierarchy_dict[level]) for level in hierarchy_levels if level in hierarchy_dict)

        for i in range(max_length):
            curr_hierarchy_info = {header: None for header in column_headers}
            for level, renamed_level in hierarchy_levels.items():
                if level in hierarchy_dict and i < len(hierarchy_dict[level]):
                    hierarchy = hierarchy_dict[level][i]
                    curr_hierarchy_info[f"{renamed_level} ID"] = str(hierarchy.get("id", None))
                    curr_hierarchy_info[f"{renamed_level} Name"] = str(hierarchy.get("name", None))
            hierarchy_feed_outputs.append(curr_hierarchy_info)

        # Return feed with headers and hierarchy information
        return self._create_feed_file(column_headers, hierarchy_feed_outputs, feed_name)

    def feed(self, hierarchy_data):
        feed_name = self._feed_name(sds_entity="hierarchylevel_feed", is_json=False)
        feed_file_content = self._hierarchy_feed_content(hierarchy_data, feed_name)
        self._save(feed_name, content=feed_file_content)
        return feed_name
