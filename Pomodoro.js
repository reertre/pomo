from typing import List, Dict

class HierarchyProcessor:
    def __init__(self, hierarchy_data: List[Dict[str, str]]):
        self.hierarchy_data = hierarchy_data

    def process_hierarchy(self) -> List[Dict[str, str]]:
        result = []

        for row in self.hierarchy_data:
            processed_row = {}
            # Dynamically process hierarchy levels (Level 10 to Level 6)
            for level in range(10, 5, -1):
                id_key = f"level_{level}_id"
                name_key = f"level_{level}_name"
                if id_key in row and name_key in row:
                    processed_row[f"Level {level} ID"] = row[id_key]
                    processed_row[f"Level {level} Name"] = row[name_key]

            # Process Subproduct, Business Area, Product Area, Company, and Group
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

    def feed(self, feed_name: str) -> str:
        """
        Save the processed hierarchy data to a feed.
        """
        processed_data = self.process_hierarchy()
        # Simulate saving the processed data to a feed
        # This logic can be replaced with actual file saving or database insertion
        saved_feed_name = self._save_feed_file(feed_name, processed_data)
        return saved_feed_name

    def _save_feed_file(self, feed_name: str, processed_data: List[Dict[str, str]]) -> str:
        """
        Save the processed hierarchy data to a feed file.
        """
        # Example implementation to save the data
        # Replace with your own saving logic (e.g., database save or file save)
        with open(f"{feed_name}.txt", "w") as file:
            for row in processed_data:
                file.write(f"{row}\n")
        return feed_name


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
feed_name = processor.feed(feed_name="hierarchy_feed")

print(f"Feed saved with name: {feed_name}")