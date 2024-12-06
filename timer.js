stages:
  - build

build:
  stage: build
  script:
    # Step 1: Run the abc.sh script to create the release folder
    - echo "Running abc.sh to create the release folder..."
    - chmod +x branches/xyz/loader_bin/abc.sh
    - branches/xyz/loader_bin/abc.sh
    - source new_release_folder.env # Load the NEW_RELEASE_FOLDER variable exported by abc.sh

    # Step 2: Display the release folder path and its contents
    - echo "The new release folder is: $NEW_RELEASE_FOLDER"
    - ls -l $NEW_RELEASE_FOLDER

    # Step 3: Perform any additional actions (optional)
    - echo "Build stage completed successfully."
  artifacts:
    paths:
      - new_release_folder.env
      - $NEW_RELEASE_FOLDER
    expire_in: 1 week