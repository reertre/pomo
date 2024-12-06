#!/bin/bash

# Set the current branch and generate a timestamped release folder name
CURRENT_BRANCH=$CI_COMMIT_BRANCH
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
NEW_RELEASE_FOLDER="branches/releases/release_${TIMESTAMP}"

# Step 1: Create the release folder
echo "Creating the release folder: $NEW_RELEASE_FOLDER..."
mkdir -p "$NEW_RELEASE_FOLDER" || { echo "Failed to create release folder"; exit 1; }

# Step 2: Simulate file generation (You can replace this with your actual logic)
echo "Generating files in $NEW_RELEASE_FOLDER..."
touch "$NEW_RELEASE_FOLDER/file1.txt"
touch "$NEW_RELEASE_FOLDER/file2.txt"
echo "File 1 content" > "$NEW_RELEASE_FOLDER/file1.txt"
echo "File 2 content" > "$NEW_RELEASE_FOLDER/file2.txt"

# Step 3: Export the release folder path for the GitLab CI pipeline
echo "NEW_RELEASE_FOLDER=$NEW_RELEASE_FOLDER" > new_release_folder.env
echo "Release folder created: $NEW_RELEASE_FOLDER"