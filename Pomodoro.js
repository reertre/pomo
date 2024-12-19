from utils.configuration import Configurations
from utils.feed.feed import Feed
from typing import List, Dict

class HierarchyLevelFeed(Feed):
    def __init__(self):
        Feed.__init__(self)
        config = Configurations()
        self.sds_hierarchy_feed_attributes_config = config.get_sds_hierarchy_attributes()

    def _hierarchy_feed_content(self, hierarchy_data: List[Dict[str, str]], feed_name: str) -> List[Dict[str, str]]:
        if "attributes" not in self.sds_hierarchy_feed_attributes_config:
            raise Exception("Did not find attributes to create hierarchy feed.")

        if not isinstance(hierarchy_data, list):
            raise Exception("The data should be of List type.")

        headers = self.sds_hierarchy_feed_attributes_config["attributes"]
        headers = headers.split(",")

        all_hierarchy_information = []
        for hierarchy in hierarchy_data:
            curr_hierarchy_info = {}
            
            # Dynamically process hierarchy levels
            for level in range(10, 5, -1):  # Levels 10 to 6
                id_key = f"level_{level}_id"
                name_key = f"level_{level}_name"
                if id_key in hierarchy and name_key in hierarchy:
                    curr_hierarchy_info[f"Level {level} ID"] = hierarchy[id_key]
                    curr_hierarchy_info[f"Level {level} Name"] = hierarchy[name_key]

            # Process Subproduct, Business Area, Product Area, Company, Group
            if "subproduct_id" in hierarchy and "subproduct_name" in hierarchy:
                curr_hierarchy_info["Subproduct ID"] = hierarchy["subproduct_id"]
                curr_hierarchy_info["Subproduct Name"] = hierarchy["subproduct_name"]
            if "business_area_id" in hierarchy and "business_area_name" in hierarchy:
                curr_hierarchy_info["Business Area ID"] = hierarchy["business_area_id"]
                curr_hierarchy_info["Business Area Name"] = hierarchy["business_area_name"]
            if "product_area_id" in hierarchy and "product_area_name" in hierarchy:
                curr_hierarchy_info["Product Area ID"] = hierarchy["product_area_id"]
                curr_hierarchy_info["Product Area Name"] = hierarchy["product_area_name"]
            if "company_id" in hierarchy and "company_name" in hierarchy:
                curr_hierarchy_info["Company ID"] = hierarchy["company_id"]
                curr_hierarchy_info["Company Name"] = hierarchy["company_name"]
            if "group_id" in hierarchy and "group_name" in hierarchy:
                curr_hierarchy_info["Group ID"] = hierarchy["group_id"]
                curr_hierarchy_info["Group Name"] = hierarchy["group_name"]

            all_hierarchy_information.append(curr_hierarchy_info)

        return self._create_feed_file(headers, all_hierarchy_information, feed_name)

    def feed(self, hierarchy_data):
        feed_name = self._feed_name(sds_entity="hierarchy", is_json=False)
        feed_file_content = self._hierarchy_feed_content(hierarchy_data, feed_name)
        self._save(feed_name, content=feed_file_content)
        return feed_name