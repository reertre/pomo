#!/bin/bash

FILE="list.txt"
declare -a tdbhist_files

# Read each line from the file and collect Tdbhist files
while IFS= read -r line; do
    # Skip blank lines
    [ -z "$line" ] && continue

    # If the line starts with "Tdbhist:" then split and save the file name
    if [[ $line == Tdbhist:* ]]; then
        IFS=':' read -r prefix type sql_file <<< "$line"
        tdbhist_files+=("$sql_file")
    fi
done < "$FILE"

# Now, outside the if statements, print all collected Tdbhist file names
for file in "${tdbhist_files[@]}"; do
    echo "$file"
done