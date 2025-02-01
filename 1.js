#!/bin/bash

# 🛠️ Step 1: Set Variables
CURRENT_BRANCH=$CI_COMMIT_BRANCH
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
NEW_RELEASE_FOLDER="branches/releases/release_${TIMESTAMP}"

echo "📢 Fetching latest changes..."
git fetch --all > /dev/null 2>&1 || { echo "❌ Error fetching branches"; exit 1; }

# 🛠️ Step 2: Identify Release Branch
if [[ "$CURRENT_BRANCH" == release/* ]]; then
  release_BRANCH="$CURRENT_BRANCH"
else
  release_BRANCH=$(git for-each-ref --sort=-committerdate refs/remotes/origin/release/* --format='%(refname:lstrip=3)' | head -n 1)
fi

if [[ -z "$release_BRANCH" ]]; then
  echo "❌ No release branch detected. Exiting..."
  exit 1
fi

# 🛠️ Step 3: Ensure Release Branch Exists
if ! git rev-parse --verify "origin/$release_BRANCH" >/dev/null 2>&1; then
    echo "❌ Release branch $release_BRANCH does not exist in origin. Exiting..."
    exit 1
fi

# 🛠️ Step 4: Get List of Changed Files
git checkout "$CURRENT_BRANCH" > /dev/null 2>&1 || { echo "❌ Error checking out current branch"; exit 1; }
git checkout "$release_BRANCH" > /dev/null 2>&1 || { echo "❌ Error checking out release branch"; exit 1; }

CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$release_BRANCH")

if [[ -z "$CHANGED_FILES" ]]; then
  echo "✅ No changes detected between '$CURRENT_BRANCH' and '$release_BRANCH'."
  exit 0
fi

# 🛠️ Step 5: Create the Release Folder
mkdir -p "$NEW_RELEASE_FOLDER" || { echo "❌ Failed to create release folder"; exit 1; }
echo "📂 Created release folder: $NEW_RELEASE_FOLDER"

# ---------------------------
# 🚀 Step 6: Copy Only Changed Files into Release Folder
# ---------------------------
echo "📢 Copying changed files into release folder..."

while IFS= read -r file; do
    if [[ "$file" != branches/Unix/* && "$file" != branches/Autosys/* && "$file" != branches/database/* ]]; then
        continue
    fi

    TARGET_PATH="$NEW_RELEASE_FOLDER/${file#branches/}"
    mkdir -p "$(dirname "$TARGET_PATH")"
    cp "$file" "$TARGET_PATH"
done <<< "$CHANGED_FILES"

echo "✅ Changed files copied successfully!"

# ---------------------------
# 🚀 Step 7: Flatten `Tdb_hist`
# ---------------------------
DATABASE_DIR="$NEW_RELEASE_FOLDER/database/Tdb_hist"
echo "📢 Flattening Tdb_hist folder..."
mkdir -p "$DATABASE_DIR"

TDB_HIST_SUBFOLDERS=("Packages" "Procedures" "Static_Data" "Tables" "Views" "Upgrade")

for subfolder in "${TDB_HIST_SUBFOLDERS[@]}"; do
    SOURCE_DIR="$NEW_RELEASE_FOLDER/database/Tdb_hist/$subfolder"

    if [[ -d "$SOURCE_DIR" ]]; then
        find "$SOURCE_DIR" -maxdepth 1 -type f -exec mv {} "$DATABASE_DIR/" \;

        if [[ "$subfolder" == "Tables" && -d "$SOURCE_DIR/Upgrade" ]]; then
            find "$SOURCE_DIR/Upgrade" -maxdepth 1 -type f -exec mv {} "$DATABASE_DIR/" \;
        fi

        if [[ "$subfolder" == "Upgrade" && -d "$SOURCE_DIR/A" ]]; then
            find "$SOURCE_DIR/A" -maxdepth 1 -type f -exec mv {} "$DATABASE_DIR/" \;
        fi
    fi
done

find "$DATABASE_DIR" -type d -empty -delete

echo "✅ Tdb_hist restructuring completed."

# ---------------------------
# 🚀 Step 8: Handle Autosys Folder
# ---------------------------
AUTOSYS_DIR="$NEW_RELEASE_FOLDER/Autosys"
echo "📢 Processing Autosys folder..."
mkdir -p "$AUTOSYS_DIR"

while IFS= read -r file; do
    if [[ "$file" == branches/Autosys/* ]]; then
        TARGET_PATH="$NEW_RELEASE_FOLDER/${file#branches/}"
        mkdir -p "$(dirname "$TARGET_PATH")"
        cp "$file" "$TARGET_PATH"
    fi
done <<< "$CHANGED_FILES"

echo "✅ Autosys folder updated with changed files."

# ---------------------------
# 🚀 Step 9: Handle Unix Folder
# ---------------------------
UNIX_DIR="$NEW_RELEASE_FOLDER/Unix"
echo "📢 Processing Unix folder..."
mkdir -p "$UNIX_DIR"

while IFS= read -r file; do
    if [[ "$file" == branches/Unix/loader-bin/* || "$file" == branches/Unix/svcflrtb-bin/* ]]; then
        TARGET_PATH="$NEW_RELEASE_FOLDER/${file#branches/}"
        mkdir -p "$(dirname "$TARGET_PATH")"
        cp "$file" "$TARGET_PATH"
    fi
done <<< "$CHANGED_FILES"

echo "✅ Unix folder updated with changed files."

# ---------------------------
# 🚀 Step 10: Export Release Folder for GitLab CI/CD
# ---------------------------
echo "NEW_RELEASE_FOLDER=$NEW_RELEASE_FOLDER" | tee new_release_folder.env
echo "🎯 Release folder created and saved: $NEW_RELEASE_FOLDER"