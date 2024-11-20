import os

def feed(self, system_data):
    feed_name = self._feed_name(sds_entity="system_feed", is_json=False)
    feed_file_content = self._system_feed_content(system_data)
    
    # Log the feed name (file location)
    print(f"File is being created at: {feed_name}")
    logger.info(f"File is being created at: {feed_name}")
    
    self._save(feed_name, content=feed_file_content)
    
    # Check if the file was created
    if os.path.exists(feed_name):
        print(f"File successfully created at: {feed_name}")
        logger.info(f"File successfully created at: {feed_name}")
    else:
        print(f"File creation failed: {feed_name}")
        logger.error(f"File creation failed: {feed_name}")
    
    return feed_name