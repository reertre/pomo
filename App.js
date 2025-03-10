#!/bin/bash

FILE="list.txt"

# Read each line from the file
while IFS= read -r line; do
    # Skip blank lines
    if [ -z "$line" ]; then
        continue
    fi

    # Check if the line starts with "Tdbhist:" using pattern matching
    if [[ $line == Tdbhist:* ]]; then
        # Split the line by colon into prefix, type, and sql_file
        IFS=':' read -r prefix type sql_file <<< "$line"
        echo "Matched line. Processing SQL file: $sql_file"
        
        # Replace the following command with your actual SQL execution command.
        # For example, for MySQL:
        # mysql -u username -p database < "$sql_file"
        #
        # Or for sqlplus (Oracle):
        # sqlplus -S /nolog <<EOF
        # CONNECT your_username/your_password
        # @$sql_file
        # EXIT
        # EOF
        
    else
        # For lines that do not match "Tdbhist:" pattern
        echo "Unmatched line: $line"
    fi

done < "$FILE"