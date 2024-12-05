stages:
  - compare-and-release

variables:
  RELEASE_FOLDER: "release_${CI_PIPELINE_ID}" # Unique release folder

compare-and-release:
  stage: compare-and-release
  script:
    - echo "Determining the feature branch..."
    - if [[ "$CI_COMMIT_BRANCH" == feature/* ]]; then
        FEATURE_BRANCH="$CI_COMMIT_BRANCH"; 
      elif [[ -n "$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME" ]]; then
        FEATURE_BRANCH="$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME";
      else
        echo "Fetching all branches to find the latest feature branch...";
        git fetch --all
        FEATURE_BRANCH=$(git for-each-ref --sort=-committerdate refs/remotes/origin/feature/* --format='%(refname:lstrip=3)' | head -n 1);
      fi
    - if [[ -z "$FEATURE_BRANCH" ]]; then
        echo "No feature branch detected.";
        exit 1;
      fi
    - echo "Detected feature branch: $FEATURE_BRANCH"
    - chmod +x scripts/compare_and_release.sh
    - ./scripts/compare_and_release.sh "$CI_COMMIT_BRANCH" "$FEATURE_BRANCH" "$RELEASE_FOLDER"
  artifacts:
    paths:
      - $RELEASE_FOLDER
    expire_in: 1 week