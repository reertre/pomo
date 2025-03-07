#!/usr/bin/env bash

# 1) Update PATH, source devprofile if needed
export PATH=/flex_data/mfr_ft/loader/bin:$PATH
source ../devprofile

# 2) Source your parameter file (sequence.sh)
#   Because 31.0_tdb_hist_1.sh is in tdb_hist/ and sequence.sh is in database/,
#   we go one directory up (..) to find it.
source ../sequence.sh

# 3) Derive a prefix from this script’s filename (optional)
prefix="$(basename "$0" .sh)"

# 4) Define your standard start/end scripts
std_start="31.0_tdb_hist_1.sql"
std_end="31.0_tdb_hist_2.sql"

# 5) Check that they exist
if [ ! -f "$std_start" ]; then
  echo "Standard start script $std_start not found" >&2
fi

if [ ! -f "$std_end" ]; then
  echo "Standard end script $std_end not found" >&2
fi

# 6) Print the execution order
echo "Execution order:"
echo "  $std_start"
for file in "${tdb_hist[@]}"; do
  echo "  $file"
done
echo "  $std_end"

# 7) Run everything in one SQL*Plus session
sqlplus -s login_tdb_hist <<EOF
  SET echo on timing on trimspool on scan off pagesize 0 linesize 1000
  SPOOL ${prefix}.log

  PROMPT Executing ${std_start}
  @${std_start}

$( for file in "${tdb_hist[@]}"; do
    echo "  PROMPT Executing $file"
    echo "  @$file"
done )

  PROMPT Executing ${std_end}
  @${std_end}

  SPOOL OFF
EOF