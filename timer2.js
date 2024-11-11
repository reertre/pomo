#!/bin/bash

# Detect the current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"

# Find the most recent feature branch by commit date
FEATURE_BRANCH=$(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads/feature/* | head -n 1)

# Check if a feature branch was found
if [ -z "$FEATURE_BRANCH" ]; then
  echo "Error: No feature branches found."
  exit 1
fi

echo "Most recent feature branch detected: $FEATURE_BRANCH"

# Generate a timestamped release folder name
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RELEASE_FOLDER="release-$TIMESTAMP"
echo "Generated release folder name: $RELEASE_FOLDER"

# Fetch the latest updates from the detected feature branch
echo "Fetching the latest updates from the feature branch '$FEATURE_BRANCH'..."
git fetch origin "$FEATURE_BRANCH:$FEATURE_BRANCH"

# Compare the current branch and the feature branch to list changed files
echo "Comparing the current branch with feature branch '$FEATURE_BRANCH'..."
CHANGED_FILES=$(git diff --name-only "$CURRENT_BRANCH" "$FEATURE_BRANCH")
echo "Files changed between $CURRENT_BRANCH and $FEATURE_BRANCH:"
echo "$CHANGED_FILES"

# Ensure .gitlab-ci.yml is included if it's among the changed files
if [[ "$CHANGED_FILES" == *".gitlab-ci.yml"* ]]; then
  echo ".gitlab-ci.yml is among the changed files and will be included in the release folder."
else
  CHANGED_FILES="$CHANGED_FILES .gitlab-ci.yml"
fi

# Create the release folder in the current branch
echo "Creating release folder at: $RELEASE_FOLDER"
mkdir -p "$RELEASE_FOLDER"

# Copy the changed files from the feature branch to the release folder in the current branch
for file in $CHANGED_FILES; do
  mkdir -p "$RELEASE_FOLDER/$(dirname "$file")"
  git show "$FEATURE_BRANCH:$file" > "$RELEASE_FOLDER/$file"
  echo "Copied changed file: $RELEASE_FOLDER/$file"
done

echo "Release folder created successfully at $RELEASE_FOLDER with all changed files."

# Create a tag with the release folder name
echo "Creating tag '$RELEASE_FOLDER'..."
git tag -a "$RELEASE_FOLDER" -m "Release tag for $RELEASE_FOLDER"
git push origin "$RELEASE_FOLDER"
echo "Tag '$RELEASE_FOLDER' created and pushed to origin."

# Create a commit mask using the latest commit hash
COMMIT_MASK=$(git rev-parse HEAD)
echo "Commit mask (latest commit hash): $COMMIT_MASK"