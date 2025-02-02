#!/bin/bash

CURRENT_BRANCH=$CI_DEFAULT_BRANCH
# Generate a timestamped release folder name
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
RELEASE_FOLDER="branches/releases/release-$TIMESTAMP"

echo "Fetching all remote branches..."
git fetch --all > /dev/null 2>&1 || { echo "Error fetching branches"; exit 1; }

echo "Detecting the release branch..."
if [[ "$CURRENT_BRANCH" == release/* ]]; then
    release_BRANCH="$CURRENT_BRANCH"
    echo "Current branch is a release branch: $release_BRANCH"
else
    echo "Finding the latest updated release branch..."
    release_BRANCH=$(git for-each-ref --sort=-committerdate refs/remotes/origin/release/* --format='%(refname:lstrip=3)' | head -n 1)
fi

echo "Detected release branch: $release_BRANCH"

echo "Validating release branch '$release_BRANCH'..."
if ! git ls-remote --heads origin "$release_BRANCH" > /dev/null 2>&1; then
    echo "Error: Branch '$release_BRANCH' does not exist in the remote repository."
    exit 1
fi

echo "Fetching the latest updates from '$release_BRANCH'..."
git fetch origin "$release_BRANCH:$release_BRANCH" > /dev/null 2>&1 || { echo "Error fetching release branch"; exit 1; }

echo "Comparing '$CURRENT_BRANCH' with '$release_BRANCH'..."
git checkout "$CURRENT_BRANCH" > /dev/null 2>&1 || { echo "Error checking out current branch"; exit 1; }
git checkout "$release_BRANCH" > /dev/null 2>&1 || { echo "Error checking out release branch"; exit 1; }

# Get the list of changed files, but ignore 'Grants/', 'Sequences/', and 'Triggers/'
CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$release_BRANCH" | grep -vE 'database/tdb_hist/(Grants|Sequences|Triggers)/')

if [[ -z "$CHANGED_FILES" ]]; then
    echo "No relevant changes detected (ignoring Grants, Sequences, and Triggers in tdb_hist)."
    exit 0
fi

latestdir=$(pwd)
echo "Current dir is $latestdir"
mkdir -p "$RELEASE_FOLDER"

# Copy changed files to the new release folder
echo "Copying changed files..."
for file in $CHANGED_FILES; do
    clean_path="${file#branches/}"  # Remove 'branches/' prefix from file path
    mkdir -p "$RELEASE_FOLDER/$(dirname "$clean_path")"
    cp "$file" "$RELEASE_FOLDER/$clean_path"
    echo "Copied: $file -> $RELEASE_FOLDER/$clean_path"
done

echo "Release folder created successfully at $RELEASE_FOLDER with all changed files."

# Restructure unix
BASE_unix_DIR="$RELEASE_FOLDER/unix"
mkdir -p "$RELEASE_FOLDER/unix"
find "$BASE_unix_DIR" -type f -exec mv {} "$RELEASE_FOLDER/unix/" \;
find "$BASE_unix_DIR" -type d -empty -delete

# Restructure autosys
BASE_autosys_DIR="$RELEASE_FOLDER/autosys"
mkdir -p "$RELEASE_FOLDER/autosys"
find "$BASE_autosys_DIR" -type f -exec mv {} "$RELEASE_FOLDER/autosys/" \;
find "$BASE_autosys_DIR" -type d -empty -delete

# Move only allowed subdirectories from tdb_hist/
BASE_TDB_DIR="$RELEASE_FOLDER/database/tdb_hist"
mkdir -p "$BASE_TDB_DIR"

# Find all files inside tdb_hist/ but EXCLUDE Grants, Sequences, Triggers
find "$BASE_TDB_DIR" -type f | grep -vE 'tdb_hist/(Grants|Sequences|Triggers)/' | while read file; do
    mv "$file" "$BASE_TDB_DIR/"
done

# Remove only the unwanted directories
rm -rf "$BASE_TDB_DIR/Grants"
rm -rf "$BASE_TDB_DIR/Sequences"
rm -rf "$BASE_TDB_DIR/Triggers"

echo "✅ All tdb_hist/ files moved directly under 'tdb_hist/' (excluding Grants, Sequences, and Triggers)."

# Ensure new_release_folder.env exists
touch "$RELEASE_FOLDER/new_release_folder.env"

# Clean up 'branches' if it still exists inside the release folder
if [[ -d "$RELEASE_FOLDER/branches" ]]; then
    echo "Removing unnecessary 'branches/' folder..."
    rm -rf "$RELEASE_FOLDER/branches"
    echo "✅ 'branches/' folder removed successfully."
fi

echo "🎉 Process completed successfully!"