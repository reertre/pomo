if book_id_system == "IMPACT" and system_entity is not None:
    idx = book_name.find(system_entity, 0)
    if idx != -1 and book_name[idx:] == system_entity:
        # Extract the name up to the start of system_entity
        first_half = book_name[0:idx].strip()
        
        # Split the name by '.' and ensure only unique parts are kept in sequence
        parts = first_half.split('.')
        
        # Keep only the first part as the unique name for consistency
        if parts:
            unique_name = parts[0]
            return unique_name

    return system_entity

return book_name
