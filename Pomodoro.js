from typing import List, Dict

class HierarchyProcessor:
    def __init__(self, hierarchy_data: List[Dict[str, str]]):
        self.hierarchy_data = hierarchy_data

    def process_hierarchy(self) -> List[Dict[str, str]]:
        result = []

        for row in self.hierarchy_data:
            processed_row = {}

            # Explicitly process each hierarchy level
            if "level_10_id" in row and "level_10_name" in row:
                processed_row["Level 10 ID"] = row["level_10_id"]
                processed_row["Level 10 Name"] = row["level_10_name"]
            if "level_9_id" in row and "level_9_name" in row:
                processed_row["Level 9 ID"] = row["level_9_id"]
                processed_row["Level 9 Name"] = row["level_9_name"]
            if "level_8_id" in row and "level_8_name" in row:
                processed_row["Level 8 ID"] = row["level_8_id"]
                processed_row["Level 8 Name"] = row["level_8_name"]
            if "level_7_id" in row and "level_7_name" in row:
                processed_row["Level 7 ID"] = row["level_7_id"]
                processed_row["Level 7 Name"] = row["level_7_name"]
            if "level_6_id" in row and "level_6_name" in row:
                processed_row["Level 6 ID"] = row["level_6_id"]
                processed_row["Level 6 Name"] = row["level_6_name"]

            # Explicitly process additional attributes
            if "subproduct_id" in row and "subproduct_name" in row:
                processed_row["Subproduct ID"] = row["subproduct_id"]
                processed_row["Subproduct Name"] = row["subproduct_name"]
            if "business_area_id" in row and "business_area_name" in row:
                processed_row["Business Area ID"] = row["business_area_id"]
                processed_row["Business Area Name"] = row["business_area_name"]
            if "product_area_id" in row and "product_area_name" in row:
                processed_row["Product Area ID"] = row["product_area_id"]
                processed_row["Product Area Name"] = row["product_area_name"]
            if "company_id" in row and "company_name" in row:
                processed_row["Company ID"] = row["company_id"]
                processed_row["Company Name"] = row["company_name"]
            if "group_id" in row and "group_name" in row:
                processed_row["Group ID"] = row["group_id"]
                processed_row["Group Name"] = row["group_name"]

            # Append processed row to result
            result.append(processed_row)

        return result


# Integration with feed method
class HierarchyFeed:
    def __init__(self, hierarchy_data: List[Dict[str, str]]):
        self.hierarchy_processor = HierarchyProcessor(hierarchy_data)

    def feed(self):
        # Process the hierarchy data
        processed_data = self.hierarchy_processor.process_hierarchy()

        # Define the feed name (Example: replace with dynamic logic if needed)
        feed_name = "Hierarchy_Feed"

        # Simulate saving or returning processed data
        return {
            "feed_name": feed_name,
            "processed_data": processed_data
        }