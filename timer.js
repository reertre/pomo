stages:
  - compare-and-release

variables:
  # Dynamically fetch the latest feature branch with recent changes
  FEATURE_BRANCH: "$(git branch -r --sort=-committerdate | grep 'origin/feature/' | head -n 1 | sed 's|origin/||')"
  RELEASE_FOLDER: "release_${CI_PIPELINE_ID}" # Unique release folder for each pipeline

compare-and-release:
  stage: compare-and-release
  script:
    - echo "Preparing to compare branches..."
    - echo "Detected feature branch: $FEATURE_BRANCH"
    - chmod +x scripts/compare_and_release.sh
    - ./scripts/compare_and_release.sh "$CI_COMMIT_BRANCH" "$FEATURE_BRANCH" "$RELEASE_FOLDER"
  artifacts:
    paths:
      - $RELEASE_FOLDER
    expire_in: 1 week