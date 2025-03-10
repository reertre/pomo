# Scheme: TDB_HIST
FINRR_56781_FR_DB_PURGE_CONFIG_1.dat
FINRR_55463_LNO_DEAL_1.sql
FINRR_56781_TEIB_RADIAL_CETB_2.sql
FINRR_56781_FR_SOURCE_FILE_3.sql

# Scheme: AUTOSYS
FINRR_12345_AUTOSYS_JOB1.jil
FINRR_12345_AUTOSYS_JOB2.jil

# Scheme: #!/bin/bash

# The input file with the list of SQL file references
FILE="list.txt"

# Loop through each line in the file
while IFS= read -r line; do
    # Check if the line starts with "Tdbhist:"
    if [[ $line == Tdbhist:* ]]; then
        # Extract the SQL filename (assuming the format is "Tdbhist:tables:filename.sql")
        sql_file=$(echo "$line" | cut -d':' -f3)
        
        # Here you can "call" the SQL file as needed.
        # For example, if you want to execute it using mysql, you could do:
        # mysql -u username -p database < "$sql_file"
        
        # For demonstration, we simply print the SQL file name.
        echo "Processing SQL file: $sql_file"
    fi
done < "$FILE"



