#!/bin/bash

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)  # Detect the current branch
RELEASE_TAG="release_30.5"  # Replace with your specific release tag
LAST_TAG=$(git describe --tags --abbrev=0)  # Get the previous tag for comparison


echo "Current branch is: $CURRENT_BRANCH"
git pull origin $CURRENT_BRANCH  # Pull the latest changes for the detected branch

echo "Fetching commits between $LAST_TAG and $RELEASE_TAG..."
COMMITS=$(git log $LAST_TAG..$RELEASE_TAG --oneline)
echo "$COMMITS"


echo "Listing changed files between $LAST_TAG and $RELEASE_TAG..."
CHANGED_FILES=$(git diff --name-only $LAST_TAG..$RELEASE_TAG)
echo "$CHANGED_FILES"

echo "Build file executed successfully."
