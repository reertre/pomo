#!/bin/bash
###############################################################################
# 310_tdb_hist.sh - Example full script
# 
# 1) Sets up environment
# 2) Reads "File_Sequence.txt" for .sql and .dat references
# 3) Loads .dat files using sqlldr
# 4) Derives standard scripts (a.sql, c.sql) from last .dat
# 5) Executes standard start script, all .sql files, standard end script
###############################################################################

# 1) ENVIRONMENT SETUP
PATH=~/flex_data/mfr_flt/loader/bin:$PATH
source .devprofile   # This should define $login_tdb_hist or similar

FILE="File_Sequence.txt"

# Arrays to store the files we find
declare -a tdbhist_files=()
declare -a tdbhist_dat_files=()

###############################################################################
# 2a) Read the file for .sql references (lines starting with 'tdb_hist:')
###############################################################################
while IFS= read -r line
do
  # Skip blank lines
  [ -z "$line" ] && continue

  # If line starts with 'tdb_hist:', parse out the .sql file
  if [[ $line == tdb_hist:* ]]; then
    # Example line: tdb_hist:tables:FINRR_7473_fhjd.sql
    IFS=':' read -r prefix type sql_file <<< "$line"
    tdbhist_files+=( "$sql_file" )
  fi
done < "$FILE"

###############################################################################
# 2b) Read the file again for .dat references (lines starting with 'tdb_hist_dat:')
###############################################################################
while IFS= read -r line
do
  # Skip blank lines
  [ -z "$line" ] && continue

  # If line starts with 'tdb_hist_dat:', parse out the .dat file
  if [[ $line == tdb_hist_dat:* ]]; then
    # Example line: tdb_hist_dat:tables:FINRR_7473_fhjd_1.dat
    IFS=':' read -r prefix type dat_file <<< "$line"
    tdbhist_dat_files+=( "$dat_file" )
  fi
done < "$FILE"

###############################################################################
# 3) LOAD THE .dat FILES USING SQLLDR
###############################################################################
for tdbhist_dat_file in "${tdbhist_dat_files[@]}"
do
  echo "Loading data file: $tdbhist_dat_file"
  # Make sure this is correct: typically 'control=' expects a .ctl file.
  # If your .dat is actually the control file, keep it as is.
  # Otherwise, you might need something like: sqlldr $login_tdb_hist control=${tdbhist_dat_file%.dat}.ctl
  sqlldr $login_tdb_hist control="$tdbhist_dat_file"
done

###############################################################################
# 4) DERIVE STANDARD SCRIPTS (a.sql, c.sql) FROM THE LAST .dat FILE
###############################################################################
# If no .dat files were found, this step might fail. Check for that:
if [ ${#tdbhist_dat_files[@]} -eq 0 ]; then
  echo "No tdb_hist_dat files found. Cannot derive std_start/std_end."
  exit 1
fi

# We'll use the LAST .dat file in the array
last_dat="${tdbhist_dat_files[-1]}"

# Remove directory path and '.dat' suffix
prefix=$(basename "$last_dat" .dat)

# Remove the last character if your naming scheme has a letter at the end (e.g., '..._1b.dat')
# If you do not need to remove a character, comment this out.
prefix=${prefix%?}

# Construct standard start/end script names
std_start="${prefix}a.sql"
std_end="${prefix}c.sql"

###############################################################################
# 5) CHECK THAT THE STANDARD SCRIPTS EXIST
###############################################################################
if [ ! -f "$std_start" ]; then
  echo "ERROR: Standard start script '$std_start' not found!" >&2
  exit 1
fi

if [ ! -f "$std_end" ]; then
  echo "ERROR: Standard end script '$std_end' not found!" >&2
  exit 1
fi

###############################################################################
# 6) EXECUTE SCRIPTS (SPOOL ON -> run scripts -> SPOOL OFF)
###############################################################################
# We'll spool all output to 'tdbhist.log' for review.
# If you prefer a different name, just change 'tdbhist.log' below.

sqlplus -s "$login_tdb_hist" <<EOF
SPOOL tdbhist.log

-- Optional: Some SET commands for a cleaner, non-interactive run:
SET ECHO OFF
SET FEEDBACK OFF
SET VERIFY OFF
SET TRIMSPOOL ON
SET SCAN OFF
SET PAGESIZE 0
SET LINESIZE 2000

PROMPT Running standard start script: $std_start
@$std_start

PROMPT Running main Tdbhist SQL files...
$( for f in "${tdbhist_files[@]}"; do
    echo "@$f"
  done )

PROMPT Running standard end script: $std_end
@$std_end

SPOOL OFF
EXIT
EOF

echo "=== All steps complete. ==="