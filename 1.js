DECLARE
    v_folder_path VARCHAR2(200) := 'TDB_HIST/synonyms'; -- Known folder name
    v_sql_script VARCHAR2(500);
BEGIN
    -- Loop through all files in the 'synonyms' folder and execute them
    FOR sql_file IN (SELECT file_name FROM all_directories WHERE directory_name = v_folder_path) LOOP
        v_sql_script := '@"' || v_folder_path || '/' || sql_file.file_name || '"';
        EXECUTE IMMEDIATE v_sql_script;
    END LOOP;
END;
/