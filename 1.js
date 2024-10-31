#!/bin/bash

# Define the release folder name (e.g., CHG1016576087/release_30.5) as an argument
RELEASE_PATH=$1

# Check if a release path was provided
if [ -z "$RELEASE_PATH" ]; then
  echo "Please provide a release path (e.g., ./Unix_Deploy.sh CHG1016576087/release_30.5)"
  exit 1
fi

# Define the base directory for the new release in the root of the current branch
NEW_RELEASE_FOLDER="./release/$RELEASE_PATH"

# Fetch the latest changes and tags from master
echo "Fetching updates from master branch..."
git fetch origin master --tags

# Verify the release path in master
if ! git ls-tree -d origin/master "releases/$RELEASE_PATH" > /dev/null 2>&1; then
  echo "Error: The specified release path 'releases/$RELEASE_PATH' does not exist in master."
  exit 1
fi

# Step 1: Create the main release folder at the root level in the current branch
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Step 2: Replicate the directory structure from the specified release in master
echo "Replicating directory structure from master for $RELEASE_PATH..."
for dir in $(git ls-tree -d --name-only "origin/master:releases/$RELEASE_PATH"); do
  mkdir -p "$NEW_RELEASE_FOLDER/$dir"
  echo "Created directory: $NEW_RELEASE_FOLDER/$dir"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."
