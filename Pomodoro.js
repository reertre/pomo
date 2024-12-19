from typing import List, Dict

class HierarchyProcessor:
    def __init__(self, hierarchy_data: List[Dict[str, str]]):
        self.hierarchy_data = hierarchy_data

    def process_hierarchy(self) -> List[Dict[str, str]]:
        result = []

        # Iterate over each row in the hierarchy data
        for row in self.hierarchy_data:
            processed_row = {}
            
            # Process hierarchy levels dynamically
            for level in range(10, 5, -1):  # Levels 10 to 6
                level_type = f"Level {level}"
                id_key = f"level_{level}_id"
                name_key = f"level_{level}_name"

                # Map IDs and Names for each hierarchy level
                if id_key in row and name_key in row:
                    processed_row[f"{level_type} ID"] = row[id_key]
                    processed_row[f"{level_type} Name"] = row[name_key]

            # Process additional hierarchy attributes: Subproduct, Business Area, Product Area, Company, Group
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

            # Append processed row to the result list
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