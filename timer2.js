#!/usr/bin/env bash
set -e

# Gather all .dat files that match the pattern FINRR_7483_*.dat
files=(FINRR_7483_*.dat)

# If no matching files exist, exit with an error (or handle however you prefer)
if [ ${#files[@]} -eq 0 ]; then
    echo "No FINRR_7483_*.dat files found!"
    exit 1
fi

# Sort the files by the numeric part after the second underscore and before .dat
# e.g., FINRR_7483_1.dat -> extracts "1"
sorted_files=($(for f in "${files[@]}"; do
    # Extract the number after the last underscore
    # Example: FINRR_7483_1.dat -> "1"
    order=$(echo "$f" | sed -E 's/.*_([0-9]+)\.dat/\1/')
    echo "$order $f"
done | sort -n | awk '{print $2}'))

# Now loop over the sorted list and call sqldr on each file
for dat_file in "${sorted_files[@]}"; do
    echo "Loading $dat_file..."
    sqldr "$login_tdb_hist" control="$dat_file"
done