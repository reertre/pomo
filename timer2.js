#!/bin/bash

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"

# Prompt for the feature branch name
read -p "Enter the feature branch name to compare (e.g., feature/FINRR-53522-gitlab-migration): " FEATURE_BRANCH

# Generate a timestamped release folder name
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RELEASE_FOLDER="release-$TIMESTAMP"
echo "Generated release folder name: $RELEASE_FOLDER"

# Check if the feature branch exists in the remote repository
if ! git ls-remote --heads origin "$FEATURE_BRANCH" &> /dev/null; then
  echo "Error: Branch '$FEATURE_BRANCH' does not exist in the remote repository."
  exit 1
fi

echo "Fetching the latest updates from the feature branch '$FEATURE_BRANCH'..."
git fetch origin "$FEATURE_BRANCH:$FEATURE_BRANCH"

echo "Comparing the current branch with feature branch '$FEATURE_BRANCH'..."
CHANGED_FILES=$(git diff --name-only "$CURRENT_BRANCH" "$FEATURE_BRANCH")
echo "Files changed between $CURRENT_BRANCH and $FEATURE_BRANCH:"
echo "$CHANGED_FILES"

if [[ "$CHANGED_FILES" == *".gitlab-ci.yml"* ]]; then
  echo ".gitlab-ci.yml is among the changed files and will be included in the release folder."
else
  CHANGED_FILES="$CHANGED_FILES .gitlab-ci.yml"
fi

echo "Creating release folder at: $RELEASE_FOLDER"
mkdir -p "$RELEASE_FOLDER"

for file in $CHANGED_FILES; do
  mkdir -p "$RELEASE_FOLDER/$(dirname "$file")"
  git show "$FEATURE_BRANCH:$file" > "$RELEASE_FOLDER/$file"
  echo "Copied changed file: $RELEASE_FOLDER/$file"
done

echo "Release folder created successfully at $RELEASE_FOLDER with all changed files."

# Step 8: Create a tag with the release folder name
echo "Creating tag '$RELEASE_FOLDER'..."
git tag -a "$RELEASE_FOLDER" -m "Release tag for $RELEASE_FOLDER"
git push origin "$RELEASE_FOLDER"
echo "Tag '$RELEASE_FOLDER' created and pushed to origin."

# Step 9: Create a commit mask using the latest commit hash
COMMIT_MASK=$(git rev-parse HEAD)
echo "Commit mask (latest commit hash): $COMMIT_MASK"