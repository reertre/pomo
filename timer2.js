#!/bin/bash

# Input arguments from GitLab pipeline
CURRENT_BRANCH=$1   # Current branch in the pipeline
FEATURE_BRANCH=$2   # Auto-detected latest feature branch
RELEASE_FOLDER=$3   # Unique release folder based on pipeline ID

echo "Current branch: $CURRENT_BRANCH"
echo "Latest feature branch: $FEATURE_BRANCH"
echo "Release folder: $RELEASE_FOLDER"

# Step 1: Validate input
if [[ -z "$CURRENT_BRANCH" || -z "$FEATURE_BRANCH" || -z "$RELEASE_FOLDER" ]]; then
  echo "Error: Missing required arguments."
  exit 1
fi

# Step 2: Validate feature branch
echo "Validating feature branch '$FEATURE_BRANCH'..."
if ! git ls-remote --heads origin "$FEATURE_BRANCH" &> /dev/null; then
  echo "Error: Branch '$FEATURE_BRANCH' does not exist in the remote repository."
  exit 1
fi

# Step 3: Fetch updates from the feature branch
echo "Fetching the latest updates from '$FEATURE_BRANCH'..."
git fetch origin "$FEATURE_BRANCH:$FEATURE_BRANCH"

# Step 4: Compare branches to find changed files
echo "Comparing '$CURRENT_BRANCH' with '$FEATURE_BRANCH'..."
CHANGED_FILES=$(git diff --name-only "$CURRENT_BRANCH" "$FEATURE_BRANCH")

if [[ -z "$CHANGED_FILES" ]]; then
  echo "No changes detected between '$CURRENT_BRANCH' and '$FEATURE_BRANCH'."
  exit 0
fi

echo "Files changed between $CURRENT_BRANCH and $FEATURE_BRANCH:"
echo "$CHANGED_FILES"

# Step 5: Create release folder
echo "Creating release folder at: $RELEASE_FOLDER..."
mkdir -p "$RELEASE_FOLDER"

# Step 6: Copy changed files to release folder
for file in $CHANGED_FILES; do
  mkdir -p "$RELEASE_FOLDER/$(dirname "$file")"
  git show "$FEATURE_BRANCH:$file" > "$RELEASE_FOLDER/$file"
  echo "Copied changed file: $RELEASE_FOLDER/$file"
done

# Step 7: Completion message
echo "Release folder created successfully at $RELEASE_FOLDER with all changed files."