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

        alias_feed_outputs = list()
        alias_fields = ["value", "description", "name"]

        # Iterate over each alias entry
        for alias_book in alias_data:
            if "alias" not in alias_book:
                continue

            alias_feed = alias_book["alias"]
            if not isinstance(alias_feed, list) or len(alias_feed) == 0:
                continue

            alias_book_id = str(alias_book["id"]) if "id" in alias_book else None

            # Iterate over alias_feed entries
            for alias_entry in alias_feed:
                curr_alias_info = dict()

                # Populate headers
                for header in headers:
                    if header == "alias_book_id":
                        curr_alias_info[header] = alias_book_id
                    elif header in alias_entry:
                        curr_alias_info[header] = str(alias_entry[header])
                    else:
                        curr_alias_info[header] = None

                # Append alias information
                alias_feed_outputs.append(curr_alias_info)

        # Create the feed file with the extracted alias information
        return self._create_feed_file(headers, alias_feed_outputs, feed_name)

    def feed(self, alias_data):
        # Generate the feed name
        feed_name = self._feed_name(sds_entity="alias_feed", is_json=False)

        # Generate the feed content
        feed_file_content = self._alias_feed_content(alias_data, feed_name)

        # Save the feed file
        self._save(feed_name, content=feed_file_content)

        # Return the feed name for reference
        return feed_name