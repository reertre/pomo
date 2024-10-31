#!/bin/bash

# Define the release folder name (e.g., CHG1016576087/release_30.5) as an argument
RELEASE_PATH=$1

# Check if a release path was provided
if [ -z "$RELEASE_PATH" ]; then
  echo "Please provide a release path (e.g., ./Unix_Deploy.sh CHG1016576087/release_30.5)"
  exit 1
fi

# Define the base directory for the new release folder in the root of the current branch
NEW_RELEASE_FOLDER="./$RELEASE_PATH"

# Verify that the specified release path exists in the current branch's local filesystem
if [ ! -d "./releases/$RELEASE_PATH" ]; then
  echo "Error: The specified release path './releases/$RELEASE_PATH' does not exist in the current branch."
  exit 1
fi

# Step 1: Create the main release folder at the root level in the current branch
echo "Creating release folder structure at: $NEW_RELEASE_FOLDER"
mkdir -p "$NEW_RELEASE_FOLDER"

# Step 2: Replicate the directory structure from the specified release path locally
echo "Replicating directory structure from local './releases/$RELEASE_PATH'..."
for dir in $(find "./releases/$RELEASE_PATH" -type d); do
  # Strip the original path prefix to replicate only the subdirectory structure
  SUBDIR=${dir#"./releases/$RELEASE_PATH"}
  mkdir -p "$NEW_RELEASE_FOLDER/$SUBDIR"
  echo "Created directory: $NEW_RELEASE_FOLDER/$SUBDIR"
done

echo "Release folder structure created successfully in $NEW_RELEASE_FOLDER."
