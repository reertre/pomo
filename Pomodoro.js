from utils.configuration.configuration import Configurations
from utils.feed.feed import Feed

from re import sub
from typing import List, Dict


class AliasFeed(Feed):
    def __init__(self):
        Feed.__init__(self)
        config = Configurations()
        # Load alias feed attributes from configurations
        self._sds_alias_feed_attributes_config = config.get_sds_alias_feed_attributes()

    def _alias_feed_content(self, alias_data: List[Dict[str, any]], feed_name: str):
        # Check if 'attributes' exist in the alias feed configuration
        if "attributes" not in self._sds_alias_feed_attributes_config:
            raise Exception("Did not find attributes to create alias feed.")
        
        # Extract and clean the headers
        headers = self._sds_alias_feed_attributes_config["attributes"]
        headers = sub(r"[\n\t\s]*", "", headers).split(",")

        # Ensure 'id' is included in the headers
        if "id" not in headers:
            headers.append("id")

        # List to hold all processed alias information
        all_alias_information = list()

        # Iterate through each alias in the data
        for alias in alias_data:
            curr_alias_info = dict()
            for header in headers:
                # Extract data for each header if it exists in the alias
                if header == "id" and "alias" in alias:
                    # Special handling for 'id' to ensure it's extracted properly
                    curr_alias_info[header] = alias.get("id", None)
                elif header == "alias":
                    # Handle nested 'alias' list with 'value', 'description', 'name'
                    curr_alias_info[header] = [
                        {
                            "value": item.get("value"),
                            "description": item.get("description"),
                            "name": item.get("name"),
                        }
                        for item in alias.get("alias", [])
                    ]
                else:
                    # General handling for other headers
                    curr_alias_info[header] = alias.get(header, None)

            all_alias_information.append(curr_alias_info)

        # Create the feed file with extracted information
        return self._create_feed_file(headers, all_alias_information, feed_name)

    def feed(self, alias_data):
        # Generate the feed name
        feed_name = self._feed_name(sds_entity="alias_feed", is_json=False)

        # Generate the feed content
        feed_file_content = self._alias_feed_content(alias_data, feed_name)

        # Save the feed file
        self._save(feed_name, content=feed_file_content)

        # Return the feed name for reference
        return feed_name