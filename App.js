#!/bin/bash

FILE="list.txt"

# Read each line from the file
while IFS= read -r line; do
    # Skip any empty or blank lines
    if [ -z "$line" ]; then
        continue
    fi

    # Check if the line starts with "Tdbhist:"
    if [[ $line =~ ^Tdbhist: ]]; then
        # Parse out the fields: prefix (Tdbhist), type (tables), and sql_file
        IFS=':' read -r prefix type sql_file <<< "$line"
        echo "Matched line. Processing SQL file: $sql_file"
        
        # Example execution command (uncomment and edit as needed)
        # sqlplus -S /nolog <<EOF
        # CONNECT your_username/your_password
        # @$sql_file
        # EXIT
        # EOF
    else
        # Unmatched lines
        echo "Unmatched line: $line"
    fi

done < "$FILE"