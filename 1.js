#!/bin/bash

CURRENT_BRANCH=$CI_DEFAULT_BRANCH
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
RELEASE_FOLDER="releases/release-$TIMESTAMP"

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

if [[ -z "$release_BRANCH" ]]; then
    echo "Error: No release branch found."
    exit 1
fi

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
CHANGED_FILES=$(git diff --name-only origin/"$CURRENT_BRANCH" origin/"$release_BRANCH")

if [[ -z "$CHANGED_FILES" ]]; then
    echo "No changes detected between '$CURRENT_BRANCH' and '$release_BRANCH'."
    exit 0
fi

latestdir=$(pwd)
NEW_RELEASE_FOLDER="$latestdir/$RELEASE_FOLDER"
echo "Creating release folder at $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Define required folders
mkdir -p "$NEW_RELEASE_FOLDER/Unix"
mkdir -p "$NEW_RELEASE_FOLDER/Autosys"
mkdir -p "$NEW_RELEASE_FOLDER/database/Tdb_hist"

for file in $CHANGED_FILES; do
    # Copy only allowed files into their respective directories
    if [[ "$file" == Unix/loader-bin/* || "$file" == Unix/svcflrtb-bin/* ]]; then
        cp "$file" "$NEW_RELEASE_FOLDER/Unix/$(basename "$file")"
        echo "Copied: $file -> $NEW_RELEASE_FOLDER/Unix/$(basename "$file")"

    elif [[ "$file" == Autosys/*.jil ]]; then
        cp "$file" "$NEW_RELEASE_FOLDER/Autosys/$(basename "$file")"
        echo "Copied: $file -> $NEW_RELEASE_FOLDER/Autosys/$(basename "$file")"

    elif [[ "$file" == database/Tdb_hist/Packages/* || "$file" == database/Tdb_hist/Procedures/* || \
            "$file" == database/Tdb_hist/Tables/* || "$file" == database/Tdb_hist/Upgrade/* || \
            "$file" == database/Tdb_hist/Views/* ]]; then
        cp "$file" "$NEW_RELEASE_FOLDER/database/Tdb_hist/$(basename "$file")"
        echo "Copied: $file -> $NEW_RELEASE_FOLDER/database/Tdb_hist/$(basename "$file")"

    elif [[ "$file" == database/*.sql ]]; then
        cp "$file" "$NEW_RELEASE_FOLDER/database/$(basename "$file")"
        echo "Copied: $file -> $NEW_RELEASE_FOLDER/database/$(basename "$file")"

    else
        echo "Skipping unwanted file: $file"
    fi
done

echo "Release folder created successfully at $NEW_RELEASE_FOLDER with all selected files."
echo "Thank you"