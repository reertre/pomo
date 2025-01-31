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

# Create the release folder
mkdir -p "$NEW_RELEASE_FOLDER" || { echo "Failed to create release folder"; exit 1; }
echo "Creating release folder: $NEW_RELEASE_FOLDER"

# ---------------------------
# 🚀 UNIX FOLDER HANDLING (Only loader-bin & svcflrtb-bin)
# ---------------------------

BASE_DIR="$NEW_RELEASE_FOLDER/Unix"
echo "Processing Unix folder..."
mkdir -p "$BASE_DIR"

UNIX_SUBFOLDERS=("loader-bin" "svcflrtb-bin")

for subfolder in "${UNIX_SUBFOLDERS[@]}"; do
    SOURCE_DIR="Unix/$subfolder"
    TARGET_DIR="$BASE_DIR/$subfolder"

    if [[ -d "$SOURCE_DIR" ]]; then
        mkdir -p "$TARGET_DIR"
        cp -r "$SOURCE_DIR/"* "$TARGET_DIR/" 2>/dev/null || echo "No files found in $SOURCE_DIR"
    fi
done

echo "Unix folder restructuring completed."

# ---------------------------
# 🚀 AUTOSYS FOLDER HANDLING
# ---------------------------

AUTOSYS_DIR="$NEW_RELEASE_FOLDER/Autosys"
echo "Processing Autosys folder..."
mkdir -p "$AUTOSYS_DIR/upgrade"

if [ -d "Autosys" ]; then
    cp -r Autosys/* "$AUTOSYS_DIR/" || echo "No Autosys files found."
fi

echo "Autosys folder setup completed."

# ---------------------------
# 🚀 DATABASE FOLDER HANDLING (Tdb_hist Flattening)
# ---------------------------

DATABASE_DIR="$NEW_RELEASE_FOLDER/database/Tdb_hist"
echo "Processing Tdb_hist folder..."
mkdir -p "$DATABASE_DIR"

TDB_HIST_SUBFOLDERS=("Packages" "Procedures" "Static_Data" "Tables" "Views" "Upgrade")

for subfolder in "${TDB_HIST_SUBFOLDERS[@]}"; do
    SOURCE_DIR="database/Tdb_hist/$subfolder"

    if [[ -d "$SOURCE_DIR" ]]; then
        # Move files from these subdirectories directly into Tdb_hist/
        find "$SOURCE_DIR" -maxdepth 1 -type f -exec mv {} "$DATABASE_DIR/" \;

        # Special handling for nested folders
        if [[ "$subfolder" == "Tables" && -d "$SOURCE_DIR/Upgrade" ]]; then
            find "$SOURCE_DIR/Upgrade" -maxdepth 1 -type f -exec mv {} "$DATABASE_DIR/" \;
        fi

        if [[ "$subfolder" == "Upgrade" && -d "$SOURCE_DIR/A" ]]; then
            find "$SOURCE_DIR/A" -maxdepth 1 -type f -exec mv {} "$DATABASE_DIR/" \;
        fi

        # Remove empty directories
        rm -rf "$SOURCE_DIR"
    fi
done

echo "Tdb_hist restructuring completed. Files moved directly under Tdb_hist."

# ---------------------------
# 🚀 Export release folder for GitLab CI pipeline
# ---------------------------
echo "NEW_RELEASE_FOLDER=$NEW_RELEASE_FOLDER" | tee new_release_folder.env
echo "Release folder created and saved: $NEW_RELEASE_FOLDER"