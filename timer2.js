#!/bin/bash

# Input Arguments
CURRENT_BRANCH=$1  # Passed from the pipeline
WORKING_DIR=$2     # Working directory (optional)

echo "Starting build process for branch: $CURRENT_BRANCH"
echo "Working directory: $WORKING_DIR"

# Step 1: Validate Input
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Error: No branch specified."
  exit 1
fi

# Step 2: Prepare Build Directory
BUILD_DIR="build_output/${CURRENT_BRANCH}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BUILD_DIR"

echo "Copying source files to build directory..."
cp -r src/* "$BUILD_DIR"  # Replace `src/` with your source directory
if [[ $? -ne 0 ]]; then
  echo "Error: Failed to copy source files."
  exit 1
fi

# Step 3: Create Build Artifact
echo "Creating build artifact..."
cd "$BUILD_DIR"
zip -r "../build.zip" .  # Zip the contents of the build directory
cd - >/dev/null

if [[ $? -ne 0 ]]; then
  echo "Error: Failed to create build artifact."
  exit 1
fi

echo "Build artifact created successfully at build.zip."
echo "Build process completed."