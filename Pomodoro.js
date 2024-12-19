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

        if not isinstance(hierarchy_data, List):
            raise Exception("The data should be of List type.")

        headers = self._sds_hierarchy_attributes_config["attributes"]
        headers = sub(r"[\n\t\s]*", "", headers).split(",")

        # Group hierarchy data by type to avoid repeated filtering
        grouped_data = {}
        for item in hierarchy_data:
            item_type = item.get("type")
            if item_type not in grouped_data:
                grouped_data[item_type] = []
            grouped_data[item_type].append(item)

        flattened_data = {}
        hierarchy_levels = ["Level10", "Level9", "Level8", "Level7", "Level6", "SubProduct", "BusinessArea", "ProductArea", "Company", "Group"]

        for level in hierarchy_levels:
            level_data = grouped_data.get(level, [])
            ids = [item.get("id") for item in level_data]
            names = [item.get("name") for item in level_data]
            flattened_data[f"{level}id"] = ids
            flattened_data[f"{level}name"] = names

        return self._create_feed_file(headers, hierarchy_data, feed_name), flattened_data

    def feed(self, hierarchy_data):
        feed_name = self._feed_name(sds_entity="hierarchy", is_json=False)
        feed_file_content, flattened_data = self._hierarchy_content(hierarchy_data, feed_name)
        self._save_feed(feed_name, feed_file_content)
        return feed_name, flattened_data
