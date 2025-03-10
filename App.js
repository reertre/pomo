#!/bin/bash

FILE="list.txt"

# Filter lines starting with 'Tdbhist:' and loop over them
cat "$FILE" | grep '^Tdbhist:' | while IFS=':' read -r prefix type sql_file; do

    # Skip if there's no actual file name
    [ -z "$sql_file" ] && continue

    echo "Processing SQL file: $sql_file"

    # Example of actually executing the file with sqlplus
    sqlplus -S /nolog <<EOF
CONNECT your_username/your_password
@$sql_file
EXIT
EOF

done