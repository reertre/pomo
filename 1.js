#!/bin/bash

# Step 1: Store the current branch name to switch back later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"

# Step 2: Fetch the latest updates from master
echo "Fetching the latest updates from the master branch..."
git fetch origin master:master

# Step 3: Verify the release path exists in master
# Define the release path (e.g., CHG1016576087/release_30.5)
RELEASE_PATH="CHG1016576087/release_30.5"

if ! git ls-tree -d --name-only master "releases/$RELEASE_PATH" > /dev/null 2>&1; then
  echo "Error: The specified release path 'releases/$RELEASE_PATH' does not exist in the master branch."
  exit 1
else
  echo "Release path 'releases/$RELEASE_PATH' exists in master branch."
fi

# Step 4: Get the commits from master for the specified release
# Define tags for the commit range
LAST_TAG=$(git describe --tags $(git rev-list --tags --max-count=1 master))
RELEASE_TAG="release_30.5"  # Replace with your specific release tag

# Get the commit log from master between the specified tags
COMMITS=$(git log master --pretty=format:"%h %s" --no-merges "$LAST_TAG".."$RELEASE_TAG")
echo "Commits between $LAST_TAG and $RELEASE_TAG on master:"
echo "$COMMITS"

# Step 5: List the files changed in the release
CHANGED_FILES=$(git diff --name-only master "$LAST_TAG" "$RELEASE_TAG")
echo "Files changed between $LAST_TAG and $RELEASE_TAG on master:"
echo "$CHANGED_FILES"

# Step 6: Create the release folder structure in the current branch
# Switch back to the original branch
echo "Switching back to the current branch: $CURRENT_BRANCH"
git checkout "$CURRENT_BRANCH"

# Define the base directory for the new release folder in the root of the current branch
NEW_RELEASE_FOLDER="./$RELEASE_PATH"

# Create the main release folder at the root level in the current branch
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Replicate the directory structure from master
echo "Replicating directory structure from master './releases/$RELEASE_PATH'..."
for dir in $(git ls-tree -d --name-only "master:releases/$RELEASE_PATH"); do
  # Strip the original path prefix to replicate only the subdirectory structure
  SUBDIR=${dir#"releases/$RELEASE_PATH"}
  mkdir -p "$NEW_RELEASE_FOLDER/$SUBDIR"
  echo "Created directory: $NEW_RELEASE_FOLDER/$SUBDIR"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."
