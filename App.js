#!/bin/sh

export PATH=/flex_data/mfr_fft/loader/bin:$PATH

FILE="/flex_data/mfr_fft/loader/bin/database_gitlab_v2_stand_scripts/release_31.0/database/File_Sequence.txt"

# Determine the prefix based on the current script's name.
# For example, if the script is "54.9_tdb_hist_1.sh", then:
# prefix = "54.9_tdb_hist_1"
prefix=`basename $0 .sh`

# Define the standard start and end SQL scripts.
std_start="${prefix}a.sql"  # e.g. 54.9_tdb_hist_1a.sql
std_end="${prefix}c.sql"    # e.g. 54.9_tdb_hist_1c.sql

# Ensure the standard scripts exist.
if [ ! -f "$std_start" ]; then
    echo "Standard start script '$std_start' not found!" >&2
    exit 1
fi

if [ ! -f "$std_end" ]; then
    echo "Standard end script '$std_end' not found!" >&2
    exit 1
fi

# The input file with the list of SQL file references

# Read each line from the file and collect Tdbhist files
while IFS= read -r line; do
    # Skip blank lines
    [ -z "$line" ] && continue

    # If the line starts with "Tdbhist:" then split and save the file name
    if [ "$line" = "Tdbhist:"* ]; then
        IFS=':' read -r prefix_type sql_file << "$line"
        tdbhist_files+=("$sql_file")
    fi
done < "$FILE"

# The input file with the list of DAT file references

# Read each line from the file and collect Tdbhist files
while IFS= read -r line; do
    # Skip blank lines
    [ -z "$line" ] && continue

    # If the line starts with "Tdbhist:" then split and save the file name
    if [ "$line" = "Tdbhist:"* ]; then
        IFS=':' read -r prefix_type sql_dat_file << "$line"
        tdbhist_dat_files+=("$sql_dat_file")
    fi
done < "$FILE"

login_tdb_hist="username/password@service"  # Add Oracle login credentials

# Execute standard start script
echo "$std_start"
for file in "${tdbhist_files[@]}"; do
    echo "$file"
done

echo "Loading Tdbhist.dat files in ${tdbhist_dat_files[@]}"
for file in "${tdbhist_dat_files[@]}"; do  # Fix loop to use tdbhist_dat_files
    sqlldr $login_tdb_hist control="$file"  # Add sqlldr execution for DAT files
done

echo "$std_end"