def _positions_of_str(self, text: str, word: str):
    positions = list()  # Initialize an empty list to store positions
    start = 0  # Start searching from the beginning of the text

    while True:
        # Find the position of `word` starting from index `start`
        start = text.find(word, start)
        
        # If `find` returns -1, `word` is not found; break the loop
        if start == -1:
            return positions  # Return the list of positions

        # Append the current found index `start` to `positions`
        positions.append(start)
        
        # Move `start` forward to continue searching for other occurrences
        start = start + len(word)
