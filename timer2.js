def run(self, **kwargs):
    keys = kwargs.keys()

    required_arguments = [
        "url",
        "criteria",
        "take",
        "fields",
        "headers",
    ]

    # Validate required arguments
    for argument in required_arguments:
        if argument not in keys:
            message = f"{argument} was not provided."
            logger.exception(message)
            raise Exception(message)

    url = kwargs["url"]
    criteria = kwargs["criteria"]
    snap = self.common_snap_config
    after_id = "0"
    take = kwargs["take"]
    fields = kwargs["fields"]
    headers = kwargs["headers"]

    total_fetched = 0
    ittr = 0
    outputs = list()

    while after_id is not None:
        body = {
            "criteria": criteria,
            "snap": snap,
            "afterId": after_id,
            "take": take,
            "fields": fields,
        }

        ittr += 1
        logger.debug(
            f"Iteration: {ittr}\nAfter_Id: {after_id}\nTotal Fetched: {total_fetched}"
        )

        body_json = json.dumps(body)
        print(body_json)
        
        # API Call
        try:
            output = requests.post(
                url=url,
                headers=headers,
                data=body_json,
                cert=(self.crt_file, self.key_file),
                verify=False,
                stream=True,
            )
        except Exception as e:
            message = f"API call failed: {str(e)}"
            logger.exception(message)
            raise Exception(message)

        # Handle status codes
        if output.status_code != 200:
            if output.status_code == 400:
                # Snap not available for the given date
                logger.warning("Snap not available for the given date.")
                return "NOT AVAILABLE"
            else:
                message = f"For ittr: {ittr}\nReceived this status code from SDS: {str(output.status_code)}. Expected 200"
                logger.exception(message)
                raise Exception(message)

        # Handle JSON response
        try:
            output_response = output.json()
        except Exception:
            message = f"For ittr: {ittr}\nThe output was not in the json format"
            logger.exception(message)
            raise Exception(message)

        # Check if response is a list
        if not isinstance(output_response, list):
            return output_response

        # Handle empty response
        if len(output_response) == 0:
            after_id = None
            continue

        total_fetched += len(output_response)
        outputs.extend(output_response)
        last_fetched = output_response[-1]
        after_id = last_fetched.get("id", None)

    return outputs