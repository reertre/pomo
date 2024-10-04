if book_id_system == "IMPACT":
    if system_entity is not None:
        idx = book_name.find(system_entity, 0)
        if idx != -1 and book_name[idx:] == system_entity:
            first_half = book_name[0 : idx].strip()
            parts = first_half.split('.')
            unique_parts = []
            for part in parts:
                if not unique_parts or unique_parts[-1] != part:
                    unique_parts.append(part)
            return '.'.join(unique_parts)

return book_name
