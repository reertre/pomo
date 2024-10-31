#!/bin/bash

# Define the release folder name (e.g., CHG1016576087/release_30.5) as an argument
RELEASE_PATH=$1

# Check if a release path was provided
if [ -z "$RELEASE_PATH" ]; then
  echo "Please provide a release path (e.g., ./Unix_Deploy.sh CHG1016576087/release_30.5)"
  exit 1
fi

# Save the current branch name to switch back later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Switch to master to check for the existence of the release path
echo "Switching to master branch to verify release path..."
git checkout master

# Verify that the specified release path exists in the master branch
if [ ! -d "./releases/$RELEASE_PATH" ]; then
  echo "Error: The specified release path './releases/$RELEASE_PATH' does not exist in the master branch."
  git checkout "$CURRENT_BRANCH"  # Switch back to the original branch before exiting
  exit 1
fi

# Switch back to the original branch
echo "Switching back to the current branch: $CURRENT_BRANCH"
git checkout "$CURRENT_BRANCH"

# Define the base directory for the new release folder in the root of the current branch
NEW_RELEASE_FOLDER="./$RELEASE_PATH"

# Step 1: Create the main release folder at the root level in the current branch
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Step 2: Replicate the directory structure from the specified release path in master
echo "Replicating directory structure from master './releases/$RELEASE_PATH'..."
for dir in $(git ls-tree -d --name-only master:./releases/$RELEASE_PATH); do
  # Strip the original path prefix to replicate only the subdirectory structure
  SUBDIR=${dir#"releases/$RELEASE_PATH"}
  mkdir -p "$NEW_RELEASE_FOLDER/$SUBDIR"
  echo "Created directory: $NEW_RELEASE_FOLDER/$SUBDIR"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."
