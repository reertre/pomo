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

# Compare branches and find changed files
CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$FEATURE_BRANCH")

if [[ -z "$CHANGED_FILES" ]]; then
  echo "No changes detected between '$CURRENT_BRANCH' and '$FEATURE_BRANCH'."
  exit 0
fi

# Create the release folder inside branches/releases
mkdir -p "$NEW_RELEASE_FOLDER" || { echo "Failed to create release folder"; exit 1; }
echo "Creating release folder: $NEW_RELEASE_FOLDER"

# ---------------------------
# 🚀 MOVING CHANGED DIRECTORIES INTO RELEASE FOLDER
# ---------------------------

echo "Copying changed directories into release folder..."

# Copy Unix folder
if [[ $(echo "$CHANGED_FILES" | grep -E "^branches/Unix/") ]]; then
    mkdir -p "$NEW_RELEASE_FOLDER/Unix"

    # Ensure we only copy files from loader-bin/ and svcflrtb-bin/
    if [[ -d "branches/Unix/loader-bin" ]]; then
        find "branches/Unix/loader-bin" -type f -exec cp {} "$NEW_RELEASE_FOLDER/Unix/" \;
    fi

    if [[ -d "branches/Unix/svcflrtb-bin" ]]; then
        find "branches/Unix/svcflrtb-bin" -type f -exec cp {} "$NEW_RELEASE_FOLDER/Unix/" \;
    fi
fi

# Copy Autosys folder
if [[ $(echo "$CHANGED_FILES" | grep -E "^branches/Autosys/") ]]; then
    mkdir -p "$NEW_RELEASE_FOLDER/Autosys"
    cp -r branches/Autosys/* "$NEW_RELEASE_FOLDER/Autosys/" 2>/dev/null || echo "No Autosys files found."
fi

# Copy Database folder
if [[ $(echo "$CHANGED_FILES" | grep -E "^branches/database/") ]]; then
    mkdir -p "$NEW_RELEASE_FOLDER/database"
    cp -r branches/database/* "$NEW_RELEASE_FOLDER/database/" 2>/dev/null || echo "No database files found."
fi

# ---------------------------
# 🚀 DATABASE FOLDER HANDLING (Flattening Tdb_hist in Release Folder)
# ---------------------------

DATABASE_DIR="$NEW_RELEASE_FOLDER/database/Tdb_hist"
echo "Processing Tdb_hist folder..."
mkdir -p "$DATABASE_DIR"

TDB_HIST_SUBFOLDERS=("Packages" "Procedures" "Static_Data" "Tables" "Views" "Upgrade")

for subfolder in "${TDB_HIST_SUBFOLDERS[@]}"; do
    SOURCE_DIR="branches/database/Tdb_hist/$subfolder"

    if [[ -d "$SOURCE_DIR" ]]; then
        # Move only files from these subdirectories directly into Tdb_hist/
        find "$SOURCE_DIR" -maxdepth 1 -type f -exec cp {} "$DATABASE_DIR/" \;

        # Handling Nested Folders
        if [[ "$subfolder" == "Tables" && -d "$SOURCE_DIR/Upgrade" ]]; then
            find "$SOURCE_DIR/Upgrade" -maxdepth 1 -type f -exec cp {} "$DATABASE_DIR/" \;
        fi

        if [[ "$subfolder" == "Upgrade" && -d "$SOURCE_DIR/A" ]]; then
            find "$SOURCE_DIR/A" -maxdepth 1 -type f -exec cp {} "$DATABASE_DIR/" \;
        fi
    fi
done

# Remove unwanted subdirectories from Tdb_hist
rm -rf "$DATABASE_DIR/Synonyms" "$DATABASE_DIR/Triggers" "$DATABASE_DIR/Sequences" "$DATABASE_DIR/Grants"

echo "Tdb_hist restructuring completed. Files moved directly under Tdb_hist."

# ---------------------------
# 🚀 Export release folder for GitLab CI pipeline
# ---------------------------
echo "NEW_RELEASE_FOLDER=$NEW_RELEASE_FOLDER" | tee new_release_folder.env
echo "Release folder created and saved: $NEW_RELEASE_FOLDER"