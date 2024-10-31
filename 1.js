#!/bin/bash

# Define the release folder name (e.g., CHG1000682360/release_11.7.2) as an argument
RELEASE_PATH=$1

# Step 1: Check if a release path was provided
if [ -z "$RELEASE_PATH" ]; then
  echo "Please provide a release path (e.g., ./Unix_Deploy.sh CHG1000682360/release_11.7.2)"
  exit 1
fi

# Define the base directory for the new release in the current branch
NEW_RELEASE_FOLDER="release/$RELEASE_PATH"

# Step 2: Fetch the latest changes from the master branch
echo "Fetching updates from master branch..."
git fetch origin master --tags

# Step 3: Identify the last release tag for comparison (commit mask)
# If there's a previous saved release, load that; otherwise, find the tag before the current one
if [ -f .last_release_tag ]; then
  LAST_TAG=$(cat .last_release_tag)
else
  LAST_TAG=$(git describe --tags --abbrev=0 $(git rev-list origin/master --tags "$RELEASE_PATH" --skip=1 --max-count=1))
fi

# Save the current release tag as the new commit mask for future runs
echo "$RELEASE_PATH" > .last_release_tag

# Step 4: Get the commits and changed files between LAST_TAG and RELEASE_PATH on master
echo "Fetching commits between $LAST_TAG and $RELEASE_PATH on master..."
COMMITS=$(git log origin/master $LAST_TAG..$RELEASE_PATH --oneline)
CHANGED_FILES=$(git diff --name-only origin/master $LAST_TAG..$RELEASE_PATH)

# Display the commits
echo "Commits between $LAST_TAG and $RELEASE_PATH:"
echo "$COMMITS"

# Display the changed files
echo "Files changed between $LAST_TAG and $RELEASE_PATH:"
echo "$CHANGED_FILES"

# Step 5: Create a release folder in the current branch and replicate the structure
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Step 6: Replicate the directory structure and copy only the changed files from master
echo "$CHANGED_FILES" | while read -r file; do
  # Get the directory path of each changed file
  DIRECTORY="$NEW_RELEASE_FOLDER/$(dirname "$file")"
  
  # Create the directory structure if it doesn't already exist
  mkdir -p "$DIRECTORY"
  
  # Copy the file from master branch to the current branch's release folder
  git show "origin/master:$file" > "$NEW_RELEASE_FOLDER/$file"
  echo "Copied file: $NEW_RELEASE_FOLDER/$file"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."
echo "Only changed files have been copied to the release folder."
