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

# Ensure feature branch exists
if ! git rev-parse --verify "origin/$FEATURE_BRANCH" >/dev/null 2>&1; then
    echo "Feature branch $FEATURE_BRANCH does not exist in origin. Exiting..."
    exit 1
fi

# Validate and fetch the feature branch
git fetch origin "$FEATURE_BRANCH:$FEATURE_BRANCH" > /dev/null 2>&1 || { echo "Error fetching feature branch"; exit 1; }

# Compare branches and find changed files (Only for Tdb_hist)
CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$FEATURE_BRANCH" -- "database/Tdb_hist/*")

if [[ -z "$CHANGED_FILES" ]]; then
  echo "No changes detected in 'Tdb_hist'."
  exit 0
fi

# Create the release folder
mkdir -p "$NEW_RELEASE_FOLDER/database/Tdb_hist" || { echo "Failed to create Tdb_hist folder"; exit 1; }
echo "Creating Tdb_hist folder: $NEW_RELEASE_FOLDER/database/Tdb_hist"

# ---------------------------
# DATABASE FILE HANDLING (Flattened structure for Tdb_hist)
# ---------------------------

DATABASE_DIR="$NEW_RELEASE_FOLDER/database/Tdb_hist"

# Define only the allowed subdirectories for Tdb_hist
TDB_HIST_SUBFOLDERS=("Packages" "Procedures" "Static_data" "Tables" "Views" "Upgrade")

for subfolder in "${TDB_HIST_SUBFOLDERS[@]}"; do
    SOURCE_DIR="database/Tdb_hist/$subfolder"

    if [[ -d "$SOURCE_DIR" ]]; then
        # Copy only files, directly into Tdb_hist (flattened structure)
        find "$SOURCE_DIR" -maxdepth 1 -type f -exec cp {} "$DATABASE_DIR/" \;
    fi
done

echo "Tdb_hist folder restructuring completed. Files moved directly under Tdb_hist."

# ---------------------------
# Export release folder for GitLab CI pipeline
# ---------------------------
echo "NEW_RELEASE_FOLDER=$NEW_RELEASE_FOLDER" | tee new_release_folder.env
echo "Release folder created and saved: $NEW_RELEASE_FOLDER"