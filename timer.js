stages:
  - compare-and-release

variables:
  GIT_DEPTH: 0 # Fetch full commit history for Git commands
  RELEASE_FOLDER: "release_${CI_PIPELINE_ID}" # Unique release folder

compare-and-release:
  stage: compare-and-release
  script:
    - echo "Fetching all branches to detect the latest feature branch..."
    - git fetch --all # Fetch all branches and commits
    - FEATURE_BRANCH=$(git branch -r --sort=-committerdate | grep 'origin/feature/' | head -n 1 | sed 's|origin/||')
      # Dynamically detect the latest feature branch
    - echo "Detected feature branch: $FEATURE_BRANCH"
    - if [[ -z "$FEATURE_BRANCH" ]]; then echo "No feature branch found."; exit 1; fi
    - chmod +x scripts/compare_and_release.sh # Ensure the script is executable
    - ./scripts/compare_and_release.sh "$CI_COMMIT_BRANCH" "$FEATURE_BRANCH" "$RELEASE_FOLDER"
  artifacts:
    paths:
      - $RELEASE_FOLDER
    expire_in: 1 week