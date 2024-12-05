stages:
  - compare-and-release

variables:
  FEATURE_BRANCH: "$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME" # Auto-detect feature branch in merge requests
  RELEASE_FOLDER: "release_${CI_PIPELINE_ID}"           # Unique folder for each pipeline

compare-and-release:
  stage: compare-and-release
  script:
    - echo "Starting branch comparison and release creation..."
    - chmod +x scripts/compare_and_release.sh           # Make the script executable
    - ./scripts/compare_and_release.sh "$CI_COMMIT_BRANCH" "$FEATURE_BRANCH" "$RELEASE_FOLDER"
  artifacts:
    paths:
      - $RELEASE_FOLDER                                 # Save the release folder as an artifact
    expire_in: 1 week                                   # Artifacts expire in 1 week