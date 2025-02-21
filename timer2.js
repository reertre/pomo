#!/usr/bin/env bash
set -e

# Assuming you already have:
#   login_tdb_hist=...
# from your environment or .devprofile

# 1) Collect BOTH .dat and .dar files that match FINRR_7483_*.dat or FINRR_7483_*.dar
files=(FINRR_7483_*.dat FINRR_7483_*.dar)

# 2) Check if we found any files
if [ ${#files[@]} -eq 0 ] || [ -z "${files[0]}" ]; then
    echo "No FINRR_7483_*.dat or .dar files found!"
    exit 1
fi

# 3) Extract the numeric portion after FINRR_7483_ and before the extension
#    Then sort numerically.
sorted_files=($(
    for f in "${files[@]}"; do
        # If the file doesn't actually exist (e.g. the pattern expands literally), skip
        [ -e "$f" ] || continue

        # Extract the number after the second underscore and before .dat or .dar
        # e.g., FINRR_7483_1.dat -> "1" or FINRR_7483_2.dar -> "2"
        order=$(echo "$f" | sed -E 's/.*_([0-9]+)\.(dat|dar)/\1/')
        echo "$order $f"
    done | sort -n | awk '{print $2}'
))

# 4) Loop through sorted files and call sqldr
for dat_file in "${sorted_files[@]}"; do
    echo "Loading $dat_file..."
    sqldr "$login_tdb_hist" control="$dat_file"
done