#!/bin/bash

CURRENT_BRANCH=$CI_DEFAULT_BRANCH
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
RELEASE_FOLDER="releases/release-$TIMESTAMP"

echo "Fetching all remote branches..."
git fetch --all --prune > /dev/null 2>&1 || { echo "Error fetching branches"; exit 1; }

echo "Resetting to latest '$CURRENT_BRANCH'..."
git reset --hard origin/"$CURRENT_BRANCH" > /dev/null 2>&1 || { echo "Error resetting branch"; exit 1; }

echo "Comparing '$CURRENT_BRANCH' with '$release_BRANCH'..."
CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$release_BRANCH")

if [[ -z "$CHANGED_FILES" ]]; then
    echo "No changes detected."
    exit 0
fi

echo "List of Changed Files:"
echo "$CHANGED_FILES"

echo "Checking actual files in working directory..."
ls -R

NEW_RELEASE_FOLDER="$(pwd)/$RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

echo "Copying files..."
for file in $CHANGED_FILES; do
    if [[ -f "$file" ]]; then
        cp "$file" "$NEW_RELEASE_FOLDER/$file"
        echo "✅ Copied: $file -> $NEW_RELEASE_FOLDER/$file"
    else
        echo "⚠️ Warning: File '$file' not found in working directory!"
    fi
done

echo "✅ Release folder created at $NEW_RELEASE_FOLDER"