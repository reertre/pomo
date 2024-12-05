#!/bin/bash

# Input arguments
CURRENT_BRANCH=$1
RELEASE_FOLDER=$2

echo "Current branch: $CURRENT_BRANCH"
echo "Release folder: $RELEASE_FOLDER"

# Step 1: Determine the feature branch
echo "Detecting the feature branch..."
if [[ "$CURRENT_BRANCH" == feature/* ]]; then
  FEATURE_BRANCH="$CURRENT_BRANCH"
  echo "Current branch is a feature branch: $FEATURE_BRANCH"
else
  echo "Fetching all remote branches to find the latest feature branch..."
  git fetch --all
  FEATURE_BRANCH=$(git for-each-ref --sort=-committerdate refs/remotes/origin/feature/* --format='%(refname:lstrip=3)' | head -n 1)
fi

if [[ -z "$FEATURE_BRANCH" ]]; then
  echo "No feature branch detected. Exiting..."
  exit 1
fi

echo "Detected feature branch: $FEATURE_BRANCH"

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

# Step 5: Create release folder and copy changed files
echo "Creating release folder at: $RELEASE_FOLDER..."
mkdir -p "$RELEASE_FOLDER"

for file in $CHANGED_FILES; do
  mkdir -p "$RELEASE_FOLDER/$(dirname "$file")"
  git show "$FEATURE_BRANCH:$file" > "$RELEASE_FOLDER/$file"
  echo "Copied changed file: $RELEASE_FOLDER/$file"
done

# Step 6: Completion message
echo "Release folder created successfully at $RELEASE_FOLDER with all changed files."