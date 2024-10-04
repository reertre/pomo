if book_id_system == "IMPACT":
    if system_entity is not None:
        idx = book_name.find(system_entity, 0)
        if idx != -1 and book_name[idx:] == system_entity:
            first_half = book_name[0 : idx].strip()
            parts = first_half.split('.')
            unique_parts = []
            for i, part in enumerate(parts):
                if i == 0 or part != parts[i - 1]:
                    unique_parts.append(part)
            return '.'.join(unique_parts)

return book_name
