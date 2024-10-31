#!/bin/bash

# Define the release folder name (e.g., CHG1000682360/release_11.7.2) as an argument
RELEASE_PATH=$1

# Check if a release path was provided
if [ -z "$RELEASE_PATH" ]; then
  echo "Error: Please provide a release path (e.g., ./Unix_Deploy.sh CHG1000682360/release_11.7.2)"
  exit 1
fi

# Determine the base directory for the new release, which is 2 levels up from the current script's location
BASE_DIR="$(dirname "$(dirname "$(pwd)")")"
NEW_RELEASE_FOLDER="$BASE_DIR/release/$RELEASE_PATH"

# Step 1: Fetch the latest changes from the master branch
echo "Fetching updates from master branch..."
if ! git fetch origin master --tags; then
  echo "Error: Failed to fetch updates from master branch."
  exit 1
fi

# Step 2: Identify the last release tag for comparison (commit mask)
# If there's a previous saved release, load that; otherwise, find the tag before the current one
if [ -f .last_release_tag ]; then
  LAST_TAG=$(cat .last_release_tag)
else
  LAST_TAG=$(git describe --tags --abbrev=0 $(git rev-list origin/master --tags "$RELEASE_PATH" --skip=1 --max-count=1))
  if [ -z "$LAST_TAG" ]; then
    echo "Error: Could not find a previous release tag for comparison."
    exit 1
  fi
fi

# Save the current release tag as the new commit mask for future runs
echo "$RELEASE_PATH" > .last_release_tag
if [ $? -ne 0 ]; then
  echo "Error: Failed to save the current release tag for future runs."
  exit 1
fi

# Step 3: Get the commits and changed files between LAST_TAG and RELEASE_PATH on master
echo "Fetching commits between $LAST_TAG and $RELEASE_PATH on master..."
COMMITS=$(git log origin/master $LAST_TAG..$RELEASE_PATH --oneline)
if [ $? -ne 0 ]; then
  echo "Error: Failed to fetch commits between $LAST_TAG and $RELEASE_PATH."
  exit 1
fi

CHANGED_FILES=$(git diff --name-only origin/master $LAST_TAG..$RELEASE_PATH)
if [ $? -ne 0 ]; then
  echo "Error: Failed to fetch the list of changed files between $LAST_TAG and $RELEASE_PATH."
  exit 1
fi

# Display the commits
echo "Commits between $LAST_TAG and $RELEASE_PATH:"
echo "$COMMITS"

# Display the changed files
echo "Files changed between $LAST_TAG and $RELEASE_PATH:"
echo "$CHANGED_FILES"

# Step 4: Create a release folder in the base directory and replicate the structure
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
if ! mkdir -p "$NEW_RELEASE_FOLDER"; then
  echo "Error: Failed to create the release folder structure at $NEW_RELEASE_FOLDER."
  exit 1
fi

# Step 5: Replicate the directory structure and copy only the changed files from master
echo "$CHANGED_FILES" | while read -r file; do
  # Get the directory path of each changed file
  DIRECTORY="$NEW_RELEASE_FOLDER/$(dirname "$file")"
  
  # Create the directory structure if it doesn't already exist
  if ! mkdir -p "$DIRECTORY"; then
    echo "Error: Failed to create directory structure at $DIRECTORY for file $file."
    exit 1
  fi
  
  # Copy the file from master branch to the current branch's release folder
  if ! git show "origin/master:$file" > "$NEW_RELEASE_FOLDER/$file"; then
    echo "Error: Failed to copy file $file to $NEW_RELEASE_FOLDER."
    exit 1
  fi
  echo "Copied file: $NEW_RELEASE_FOLDER/$file"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."
echo "Only changed files have been copied to the release folder."
