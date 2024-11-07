#!/bin/bash

# Step 1: Store the current branch name to switch back later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"

# Step 2: Fetch the latest updates from master
echo "Fetching the latest updates from the master branch..."
git fetch origin master:master

# Define specific release paths
OLD_RELEASE_PATH="CHG1000267275/release_10.2"
NEW_RELEASE_PATH="CHG1000297321/release_10.3"

# Step 3: Verify the release paths exist in master
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
NEW_RELEASE_FOLDER="./releases/$NEW_RELEASE_PATH"

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