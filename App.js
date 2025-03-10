#!/bin/bash

# Define the input file containing the list of SQL file references
FILE="list.txt"

# Use cat and grep to filter out all lines that start with "Tdbhist:"
cat "$FILE" | grep '^Tdbhist:' | while IFS=':' read -r prefix table sql_file; do
    # Only proceed if sql_file is non-empty (this skips any blank lines)
    if [ -n "$sql_file" ]; then
        echo "Processing SQL file: $sql_file"
        
        # Uncomment and modify the following line to actually run the SQL file.
        # For example, if you are using mysql:
        # mysql -u username -p database < "$sql_file"
    fi
done