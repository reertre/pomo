from utils.configuration.configuration import Configurations
from utils.feed.feed import Feed

from re import sub
from typing import List, Dict

class HierarchyLevelFeed(Feed):
    def __init__(self):
        Feed.__init__(self)

        config = Configurations()
        self._sds_hierarchy_attributes_config = config.get_sds_hierarchy_attributes()

    def _hierarchy_content(self, hierarchy_data: List[Dict[str, any]], feed_name: str):
        if "attributes" not in self._sds_hierarchy_attributes_config:
            raise Exception("Did not find attributes to create hierarchy feed.")

        if not isinstance(hierarchy_data, list):
            raise Exception("The data should be of List type.")

        headers = self._sds_hierarchy_attributes_config["attributes"]
        headers = sub(r"[\n\t\s]*", "", headers).split(",")

        # Group hierarchy data by type to avoid repeated filtering
        grouped_data = {header: [] for header in headers}
        for hierarchy in hierarchy_data:
            type_key = hierarchy.get("type")
            if type_key in grouped_data:
                grouped_data[type_key].append(hierarchy)

        hierarchy_data.append(grouped_data)  # Append grouped data to hierarchy data

        return self._create_feed_file(headers, hierarchy_data, feed_name)

    def feed(self, hierarchy_data):
        feed_name = self._feed_name(sds_entity="hierarchy", is_json=False)
        feed_file_content = self._hierarchy_content(hierarchy_data, feed_name)
        self._save_feed(feed_name, feed_file_content)
        return feed_name
