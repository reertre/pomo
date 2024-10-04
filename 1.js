if book_id_system == "IMPACT" and system_entity is not None:
    idx = book_name.find(system_entity, 0)
    if idx != -1 and book_name[idx:] == system_entity:
        first_half = book_name[0 : idx].strip()
        
        # Split the first half by '.' and create a set to ensure uniqueness
        parts = first_half.split('.')
        unique_name = parts[0] if parts else book_name  # Get the main name only

        return unique_name

return book_name
