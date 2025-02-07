#!/bin/bash

export PATH=/flex_data/mfr_ftt/loader/bin:$PATH
source .devprofile

# Determine the prefix based on the current script's name.
# For example, if the script is "54.9_tdb_hist_1.sh", then:
#   prefix = "54.9_tdb_hist_1"
prefix=$(basename "$0" .sh)

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

# Determine non‑standard scripts.
# For example, any FINRR files that include "tdb_hist" in their name.
non_standard=(FINRR_*tdb_hist*.syn FINRR_*tdb_hist*.sql)
# Remove non-matches if the glob did not find any.
# (Depending on your shell settings, unmatched globs may remain literal.)
if [ "${non_standard[0]}" == "FINRR_*tdb_hist*.syn" ]; then
    non_standard=()
fi
if [ "${non_standard[0]}" == "FINRR_*tdb_hist*.sql" ]; then
    non_standard=()
fi

echo "Execution order:"
echo "$std_start"
for f in "${non_standard[@]}"; do
    echo "$f"
done
echo "$std_end"

sqlplus -s $login_fdm <<EOF
set echo on time on timing on trimspool on scan off pagesize 0 linesize 1000
spool ${prefix}.log

prompt Executing ${prefix}.sql;
prompt ---------------------------------------;

@${std_start}
$(for f in "${non_standard[@]}"; do echo "@$f"; done)
@${std_end}

spool off
exit
EOF