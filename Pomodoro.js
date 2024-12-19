from typing import List, Dict

class HierarchyProcessor:
    def __init__(self, hierarchy_data: List[Dict[str, str]]):
        self.hierarchy_data = hierarchy_data

    def process_hierarchy(self) -> List[Dict[str, str]]:
        result = []

        for row in self.hierarchy_data:
            processed_row = {}
            # Dynamically process hierarchy levels
            for level in range(10, 5, -1):  # Levels 10 to 6
                id_key = f"level_{level}_id"
                name_key = f"level_{level}_name"
                if id_key in row and name_key in row:
                    processed_row[f"Level {level} ID"] = row[id_key]
                    processed_row[f"Level {level} Name"] = row[name_key]
            # Process Subproduct, BusinessArea, ProductArea, Company, Group
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

            result.append(processed_row)
        return result


# Example Usage
hierarchy_data = [
    {
        "level_10_id": "500001",
        "level_10_name": "Barclays Group",
        "level_9_id": "500002",
        "level_9_name": "Company Markets",
        "subproduct_id": "500003",
        "subproduct_name": "Local Markets",
        "business_area_id": "500004",
        "business_area_name": "Commodities",
    }
]

processor = HierarchyProcessor(hierarchy_data)
processed_data = processor.process_hierarchy()

# Print or Export Processed Data
for row in processed_data:
    print(row)