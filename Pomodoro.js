from typing import List, Dict

class HierarchyFeed:
    def __init__(self):
        config = Configurations()
        self.sds_hierarchy_attributes_config = config.get_sds_hierarchy_attributes()
    
    def _hierarchy_content(self, hierarchy_data: List[Dict[str, str]]) -> List[Dict[str, str]]:
        # Prepare the final output
        all_hierarchy_information = []

        for hierarchy in hierarchy_data:
            curr_hierarchy_info = {}

            # Explicit handling for each level (no for loop)
            if "level_10_id" in hierarchy and "level_10_name" in hierarchy:
                curr_hierarchy_info["Level 10 ID"] = hierarchy["level_10_id"]
                curr_hierarchy_info["Level 10 Name"] = hierarchy["level_10_name"]
            if "level_9_id" in hierarchy and "level_9_name" in hierarchy:
                curr_hierarchy_info["Level 9 ID"] = hierarchy["level_9_id"]
                curr_hierarchy_info["Level 9 Name"] = hierarchy["level_9_name"]
            if "level_8_id" in hierarchy and "level_8_name" in hierarchy:
                curr_hierarchy_info["Level 8 ID"] = hierarchy["level_8_id"]
                curr_hierarchy_info["Level 8 Name"] = hierarchy["level_8_name"]
            if "level_7_id" in hierarchy and "level_7_name" in hierarchy:
                curr_hierarchy_info["Level 7 ID"] = hierarchy["level_7_id"]
                curr_hierarchy_info["Level 7 Name"] = hierarchy["level_7_name"]
            if "level_6_id" in hierarchy and "level_6_name" in hierarchy:
                curr_hierarchy_info["Level 6 ID"] = hierarchy["level_6_id"]
                curr_hierarchy_info["Level 6 Name"] = hierarchy["level_6_name"]

            # Explicit handling for additional attributes
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

            # Append to the final output
            all_hierarchy_information.append(curr_hierarchy_info)

        return all_hierarchy_information

    def feed(self, hierarchy_data: List[Dict[str, str]]) -> str:
        # Keep feed method unchanged
        feed_name = self._feed_name(sds_entity="hierarchy", is_json=False)
        feed_file_content = self._hierarchy_content(hierarchy_data)
        self._save(feed_name, feed_file_content)
        return feed_name