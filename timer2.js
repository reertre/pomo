#!/bin/bash

# Input Arguments
CURRENT_BRANCH=$1  # Passed from the pipeline
WORKING_DIR=$2     # Working directory (optional)
NEXUS_DEPLOY=$3    # Nexus deployment flag (optional)

echo "Current branch is $CURRENT_BRANCH"
echo "Working directory is $WORKING_DIR"
echo "Nexus deployment flag is $NEXUS_DEPLOY"

# Step 1: Validate Branch
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Error: No branch specified."
  exit 1
fi

# Step 2: Check Feature Branch
FEATURE_BRANCH=$(git for-each-ref --sort=-committerdate --format '%(refname:short)' refs/heads/feature/* | head -n 1)
if [[ -z "$FEATURE_BRANCH" ]]; then
  echo "Error: No feature branches found."
  exit 1
fi
echo "Most recent feature branch detected: $FEATURE_BRANCH"

# Step 3: Fetch Changes
echo "Fetching the latest updates from branch $FEATURE_BRANCH..."
git fetch origin $FEATURE_BRANCH:$FEATURE_BRANCH

# Step 4: Compare Files Between Branches
CHANGED_FILES=$(git diff --name-only $CURRENT_BRANCH $FEATURE_BRANCH)
echo "Changed files: $CHANGED_FILES"

# Step 5: Prepare Deployment
RELEASE_FOLDER="releases/${CURRENT_BRANCH}_to_${FEATURE_BRANCH}"
mkdir -p "$RELEASE_FOLDER"

echo "Copying changed files to release folder..."
for FILE in $CHANGED_FILES; do
  cp --parents "$FILE" "$RELEASE_FOLDER"
done
echo "Deployment package created at $RELEASE_FOLDER."

# Step 6: Nexus Deployment (Optional)
if [[ "$NEXUS_DEPLOY" == "yes" ]]; then
  echo "Uploading package to Nexus..."
  # Nexus upload command (replace with your actual Nexus command)
  echo "Nexus deployment complete."
else
  echo "Nexus deployment skipped."
fi

echo "Deployment script completed successfully."