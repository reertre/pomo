#!/bin/bash

# Step 1: Store the current branch name to switch back later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"

# Step 2: Fetch the latest updates from master
echo "Fetching the latest updates from the master branch..."
git fetch origin master:master

# Step 3: Verify the release paths exist in master
# Define the release paths to compare (e.g., CHG1016576087/release_30.5 and CHG1016576087/release_31.0)
OLD_RELEASE_PATH="CHG1016576087/release_30.5"
NEW_RELEASE_PATH="CHG1016576087/release_31.0"

# Check if the old release path exists in master
if ! git ls-tree -d --name-only master "releases/$OLD_RELEASE_PATH" > /dev/null 2>&1; then
  echo "Error: The specified old release path 'releases/$OLD_RELEASE_PATH' does not exist in the master branch."
  exit 1
else
  echo "Old release path 'releases/$OLD_RELEASE_PATH' exists in master branch."
fi

# Check if the new release path exists in master
if ! git ls-tree -d --name-only master "releases/$NEW_RELEASE_PATH" > /dev/null 2>&1; then
  echo "Error: The specified new release path 'releases/$NEW_RELEASE_PATH' does not exist in the master branch."
  exit 1
else
  echo "New release path 'releases/$NEW_RELEASE_PATH' exists in master branch."
fi

# Step 4: Compare the contents of the two release folders
echo "Comparing contents between releases/$OLD_RELEASE_PATH and releases/$NEW_RELEASE_PATH on master..."
CHANGED_FILES=$(git diff --name-status master -- "releases/$OLD_RELEASE_PATH" "releases/$NEW_RELEASE_PATH")
echo "Changes between $OLD_RELEASE_PATH and $NEW_RELEASE_PATH:"
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

# Replicate the directory structure from master
echo "Replicating directory structure from master './releases/$NEW_RELEASE_PATH'..."
for dir in $(git ls-tree -d --name-only "master:releases/$NEW_RELEASE_PATH"); do
  # Strip the original path prefix to replicate only the subdirectory structure
  SUBDIR=${dir#"releases/$NEW_RELEASE_PATH"}
  mkdir -p "$NEW_RELEASE_FOLDER/$SUBDIR"
  echo "Created directory: $NEW_RELEASE_FOLDER/$SUBDIR"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."