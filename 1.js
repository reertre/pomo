def run(self, **kwargs):
    # Required arguments check
    required_arguments = ["url", "criteria", "take", "fields", "headers"]
    for argument in required_arguments:
        if argument not in kwargs:
            message = f"{argument} was not provided."
            logger.exception(message)
            raise Exception(message)

    # Retrieving values from kwargs
    url = kwargs["url"]
    criteria = kwargs["criteria"]
    snap = self.common_snap_config  # Assuming this is correctly configured
    after_id = 0
    take = kwargs["take"]
    fields = kwargs["fields"]
    headers = kwargs["headers"]

    total_fetched = 0
    ittr = 0
    outputs = []

    while after_id is not None:
        # Preparing the request body for each iteration
        body = {
            "criteria": criteria,
            "snap": snap,
            "after_id": after_id,
            "take": take,
            "fields": fields
        }

        # Added debugging print statements for URL, headers, and body_json
        body_json = json.dumps(body)
        print("Iteration:", ittr)  # Shows the current iteration count
        print("URL:", url)  # Verifies the URL being used
        print("Headers:", json.dumps(headers, indent=2))  # Shows headers in JSON format
        print("Payload (body_json):", body_json)  # Verifies the request payload structure and content

        # Sending the request
        output = requests.post(
            url=url,
            headers=headers,
            data=body_json,
            cert=(self.crt_file, self.key_file),  # Ensure self.crt_file and self.key_file are valid paths
            verify=False,  # SSL verification is disabled; change to True for production
            stream=True
        )

        # Added debugging for response status code and text
        print("Status Code:", output.status_code)  # Shows the response status code
        print("Response Text:", output.text)  # Displays the full response body for additional error details

        # Error handling if status code is not 200
        if output.status_code != 200:
            message = f"For ittr: {ittr}\nReceived this status code from SDS: {output.status_code}, Expected 200"
            logger.exception(message)  # Logs the exception with status code details
            raise Exception(message)

        # Process response as required for your application
        ittr += 1