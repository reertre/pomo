class HierarchyProcessor:
    def __init__(self):
        pass

    def process_hierarchy(self, hierarchy_data: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        Processes hierarchy data to map hierarchy levels to their respective IDs and Names dynamically.
        """
        processed_data = []

        for row in hierarchy_data:
            processed_row = {}

            # Process levels 10 to 6 dynamically
            for level in range(10, 5, -1):  # Levels 10 to 6
                id_key = f"level_{level}_id"
                name_key = f"level_{level}_name"
                if id_key in row and name_key in row:
                    processed_row[f"Level {level} ID"] = row[id_key]
                    processed_row[f"Level {level} Name"] = row[name_key]

            # Process Subproduct, Business Area, Product Area, Company, Group
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

            processed_data.append(processed_row)

        return processed_data