#!/usr/bin/env bash
set -e

echo "===== Alternative Rename Script Starting ====="
echo "Working directory: $(pwd)"
echo "Contents before rename:"
ls -al

# --- CONFIGURATION ---
RELEASE_VERSION="v15.0"
CHG="CHG165890"

OLD_CHG="CHG99999999999"
OLD_RELEASE="release_99.9"

echo "Configuration:"
echo "  OLD_CHG:      $OLD_CHG  ->  CHG: $CHG"
echo "  OLD_RELEASE:  $OLD_RELEASE  ->  RELEASE_VERSION: $RELEASE_VERSION"

# --- FIND-BASED DFS RENAME ---
# The -depth option ensures that subdirectories are processed before their parent.
find . -depth | while IFS= read -r file; do
    # Substitute OLD_CHG with CHG and OLD_RELEASE with RELEASE_VERSION using sed
    newfile=$(echo "$file" | sed -e "s/${OLD_CHG}/${CHG}/g" -e "s/${OLD_RELEASE}/${RELEASE_VERSION}/g")
    
    # Only rename if the filename has changed
    if [ "$file" != "$newfile" ]; then
        echo "Renaming: '$file' -> '$newfile'"
        mv "$file" "$newfile"
    fi
done

echo "Contents after rename:"
ls -al
echo "===== Renaming Complete ====="