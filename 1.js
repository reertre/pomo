#!/bin/bash

# Input Variables
CURRENT_BRANCH=$CI_COMMIT_BRANCH
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
NEW_RELEASE_FOLDER="branches/releases/release_${TIMESTAMP}"

echo "Fetching all remote branches..."
git fetch --all > /dev/null 2>&1 || { echo "Error fetching branches"; exit 1; }

# Detect the feature branch
if [[ "$CURRENT_BRANCH" == feature/* ]]; then
  FEATURE_BRANCH="$CURRENT_BRANCH"
else
  FEATURE_BRANCH=$(git for-each-ref --sort=-committerdate refs/remotes/origin/feature/* --format='%(refname:lstrip=3)' | head -n 1)
fi

if [[ -z "$FEATURE_BRANCH" ]]; then
  echo "No feature branch detected. Exiting..."
  exit 1
fi

# Validate and fetch the feature branch
git fetch origin "$FEATURE_BRANCH:$FEATURE_BRANCH" > /dev/null 2>&1 || { echo "Error fetching feature branch"; exit 1; }

# Compare branches and find changed files
CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$FEATURE_BRANCH")

if [[ -z "$CHANGED_FILES" ]]; then
  echo "No changes detected between '$CURRENT_BRANCH' and '$FEATURE_BRANCH'."
  exit 0
fi

# Create the release folder
mkdir -p "$NEW_RELEASE_FOLDER" || { echo "Failed to create release folder"; exit 1; }
echo "Creating release folder: $NEW_RELEASE_FOLDER"

# Process changed files
for file in $CHANGED_FILES; do
  mkdir -p "$NEW_RELEASE_FOLDER/$(dirname "$file")"
  git show "$FEATURE_BRANCH:$file" > "$NEW_RELEASE_FOLDER/$file" || echo "Error processing $file"
done

echo "Processed changed files into $NEW_RELEASE_FOLDER"

# ---------------------------
# UNIX FOLDER HANDLING (No Subfolders)
# ---------------------------

BASE_DIR="$NEW_RELEASE_FOLDER/Unix"

echo "Processing Unix folder..."

# Ensure Unix directory exists
mkdir -p "$BASE_DIR"

# Move all files from different Unix subdirectories into the main Unix folder
find "$BASE_DIR" -type f -exec mv {} "$BASE_DIR/" \;

# Remove empty subdirectories (if any were created)
find "$BASE_DIR" -type d -empty -delete

echo "Unix folder restructuring completed. All files moved directly under Unix."

# ---------------------------
# AUTOSYS FOLDER HANDLING
# ---------------------------

AUTOSYS_DIR="$NEW_RELEASE_FOLDER/Autosys"

echo "Processing Autosys folder..."
mkdir -p "$AUTOSYS_DIR/upgrade"

echo "Autosys folder setup completed."

# ---------------------------
# Export release folder for GitLab CI pipeline
# ---------------------------
echo "NEW_RELEASE_FOLDER=$NEW_RELEASE_FOLDER" > new_release_folder.env
echo "Release folder created and saved: $NEW_RELEASE_FOLDER"