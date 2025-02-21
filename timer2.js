#!/usr/bin/env bash
set -e

# 1) Collect all SQL files matching FINNRR_*.sql
#    (i.e., FINNRR_<jiranumber>_<executionorder>.sql)
files=(FINNRR_*_*.sql)

# 2) If no matching files exist, handle it gracefully
if [ ${#files[@]} -eq 0 ] || [ -z "${files[0]}" ]; then
    echo "No FINNRR_<jiranumber>_<order>.sql files found!"
    exit 0  # or exit 1, depending on your preference
fi

# 3) Extract the <executionorder> part after the second underscore and before .sql
#    Then sort the files numerically by that execution order.
sorted_files=($(
    for f in "${files[@]}"; do
        [ -f "$f" ] || continue  # skip if somehow it's not a file
        # Example filename: FINNRR_12345_7.sql
        # We want "7" as the order
        order=$(echo "$f" | sed -E 's/FINNRR_[^_]+_([0-9]+)\.sql/\1/')
        echo "$order $f"
    done | sort -n | awk '{print $2}'
))

# 4) Execute each SQL file in ascending order
echo "Execution order:"
for sql_file in "${sorted_files[@]}"; do
    echo "  $sql_file"
done

# Example of running them via sqlplus
# (Assuming you have a variable like $login_tdb_hist for your credentials)
sqlplus -s "$login_tdb_hist" <<EOF
set echo on time on timing on trimspool on scan off pagesize 0 linesize 1000

-- Optional spool if you want to log the output
spool FINNRR_execution.log

-- Loop through each file in sorted order
$(for sql_file in "${sorted_files[@]}"; do echo "@$sql_file"; done)

spool off
exit
EOF