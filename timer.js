stages:
  - build

variables:
  NEXUS_DEPLOY: "no"
  FEATURE_BRANCH: $CI_COMMIT_REF_NAME  # Dynamically fetch current branch name
  WORKING_DIR: "flexible_reporting"    # Example working directory

build:
  stage: build
  script:
    - echo "Starting build process for branch: $CI_COMMIT_REF_NAME"
    - chmod +x scripts/Unix_Deploy.sh  # Ensure the script is executable
    - bash scripts/Unix_Deploy.sh $CI_COMMIT_REF_NAME $WORKING_DIR
    - echo "Build process completed successfully."
  artifacts:
    paths:
      - build.zip  # The generated zip file
  only:
    - feature/*  # Restrict to feature branches