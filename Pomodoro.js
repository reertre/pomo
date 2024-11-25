from utils.configuration.configuration import Configurations
from utils.feed.feed import Feed

from re import sub
from typing import List, Dict


class AliasFeed(Feed):
    def __init__(self):
        Feed.__init__(self)
        config = Configurations()
        self._sds_alias_feed_attributes_config = config.get_sds_alias_feed_attributes()

    def _alias_feed_content(self, alias_data: List[Dict[str, any]], feed_name: str):
        if "attributes" not in self._sds_alias_feed_attributes_config:
            raise Exception("Did not find attributes to create alias feed.")

        headers = self._sds_alias_feed_attributes_config["attributes"]
        headers = sub(r"[\n\t\s]*", "", headers).split(",")

        all_alias_information = list()

        # Declare alias fields to be extracted
        alias_fields = ["value", "description", "name"]

        # Process each alias in alias_data
        for alias in alias_data:
            curr_alias_info = dict()
            for header in headers:
                if header == "alias" and "alias" in alias:
                    # Handle nested alias structure
                    curr_alias_info[header] = []
                    for entry in alias["alias"]:
                        curr_alias_info[header].append(
                            {field: entry.get(field) for field in alias_fields}
                        )
                elif header in alias:
                    # Handle non-nested fields
                    curr_alias_info[header] = alias[header]
                else:
                    # Default to None if the header is not in the alias
                    curr_alias_info[header] = None

            # Append the processed alias information
            all_alias_information.append(curr_alias_info)

        # Create and return the feed file
        return self._create_feed_file(headers, all_alias_information, feed_name)

    def feed(self, alias_data):
        # Generate feed name
        feed_name = self._feed_name(sds_entity="alias_feed", is_json=False)

        # Generate feed content
        feed_file_content = self._alias_feed_content(alias_data, feed_name)

        # Save the feed
        self._save(feed_name, content=feed_file_content)

        # Return the feed name for reference
        return feed_name