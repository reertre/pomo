stages:
  - build

variables:
  RELEASE_FOLDER: "release_${CI_PIPELINE_ID}" # Unique release folder
  NEXUS_GROUP: "your.nexus.group" # Define the Nexus group
  NEXUS_ARTIFACT: "release_${CI_PIPELINE_ID}" # Define artifact name
  NEXUS_RELEASE_REPO: "your-release-repository" # Target Nexus repository

build:
  stage: build
  script:
    # Step 1: Prepare and create the release folder
    - echo "Starting release process..."
    - mkdir -p branches/releases
    - chmod +x branches/unix/loader_bin/abc.sh
    - branches/unix/loader_bin/abc.sh "$RELEASE_FOLDER"

    # Step 2: Verify and list contents of the release folder
    - source new_release_folder.env
    - echo "Release folder created: $NEW_RELEASE_FOLDER"
    - ls -lR $NEW_RELEASE_FOLDER

  artifacts:
    paths:
      - $NEW_RELEASE_FOLDER # Ensure the folder is saved as an artifact
      - new_release_folder.env
    expire_in: 1 week

  include:
    - component: "$CI_SERVER_FQDN/your-company/nexus-configs@develop"
      inputs:
        nexus_artifacts: "$NEW_RELEASE_FOLDER"
        nexus_group: "$NEXUS_GROUP"
        nexus_zip_folders: "$NEW_RELEASE_FOLDER"
        nexus_release_repo: "$NEXUS_RELEASE_REPO"