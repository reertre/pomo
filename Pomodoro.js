#!/bin/bash

# Step 1: Store the current branch name to switch back later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"

# Step 2: Fetch the latest updates from master
echo "Fetching the latest updates from the master branch..."
git fetch origin master:master

# Step 3: Detect the two most recent release folders in the master branch
echo "Detecting the two most recent release folders in 'releases/' on master..."
LATEST_RELEASES=($(git ls-tree -d --name-only master releases | sort -r | head -n 2))

# Ensure we found exactly two release folders
if [ ${#LATEST_RELEASES[@]} -ne 2 ]; then
  echo "Error: Unable to detect exactly two release folders in 'releases/' on master."
  exit 1
fi

# Define the old and new release paths based on detection
OLD_RELEASE_PATH="${LATEST_RELEASES[1]}"
NEW_RELEASE_PATH="${LATEST_RELEASES[0]}"
echo "Comparing folders: Old release = $OLD_RELEASE_PATH, New release = $NEW_RELEASE_PATH"

# Step 4: Compare the contents of the two release folders and list changed files
echo "Comparing contents between releases/$OLD_RELEASE_PATH and releases/$NEW_RELEASE_PATH on master..."
CHANGED_FILES=$(git diff --name-only master -- "releases/$OLD_RELEASE_PATH" "releases/$NEW_RELEASE_PATH")
echo "Files changed between $OLD_RELEASE_PATH and $NEW_RELEASE_PATH:"
echo "$CHANGED_FILES"

# Step 5: Create the new release folder structure in the current branch
# Switch back to the original branch
echo "Switching back to the current branch: $CURRENT_BRANCH"
git checkout "$CURRENT_BRANCH"

# Define the base directory for the new release folder in the root of the current branch
NEW_RELEASE_FOLDER="./$NEW_RELEASE_PATH"

# Create the main release folder at the root level in the current branch
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Step 6: Copy the changed files from master to the new release folder in the current branch
for file in $CHANGED_FILES; do
  # Extract the path within the new release folder
  RELATIVE_PATH=${file#"releases/$NEW_RELEASE_PATH/"}

  # Create the directory structure in the current branch
  mkdir -p "$NEW_RELEASE_FOLDER/$(dirname "$RELATIVE_PATH")"

  # Copy the file content from master to the new release folder
  git show "master:$file" > "$NEW_RELEASE_FOLDER/$RELATIVE_PATH"
  echo "Copied changed file: $NEW_RELEASE_FOLDER/$RELATIVE_PATH"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER with all changed files."