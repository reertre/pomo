#!/usr/bin/env bash
#
# DFS Rename Script (Fixed)
# Replaces OLD_CHG with CHG, and OLD_RELEASE with RELEASE_VERSION in file/directory names
#

set -e  # Exit immediately if a command exits with a non-zero status

# --- CONFIGURATION ---
RELEASE_VERSION="v15.0"
CHG="CHG165890"

OLD_CHG="CHG99999999999"
OLD_RELEASE="release_99.9"

# Ensure the required variables are set
if [ -z "$CHG" ] || [ -z "$RELEASE_VERSION" ]; then
  echo "ERROR! Both CHG and RELEASE_VERSION must be defined."
  exit 1
fi

# --- DFS FUNCTION ---
dfs_rename() {
  local path="$1"

  # 1) Recurse into subdirectories first (bottom-up)
  for entry in "$path"/*; do
    [ -e "$entry" ] || continue
    if [ -d "$entry" ]; then
      dfs_rename "$entry"
    fi
  done

  # 2) Now rename items (files/directories) in the current directory
  for entry in "$path"/*; do
    [ -e "$entry" ] || continue

    local name
    name="$(basename "$entry")"
    local dir
    dir="$(dirname "$entry")"

    # Replace OLD_CHG with CHG, and OLD_RELEASE with RELEASE_VERSION
    local new_name="$name"
    new_name="${new_name//$OLD_CHG/$CHG}"
    new_name="${new_name//$OLD_RELEASE/$RELEASE_VERSION}"

    # Only rename if the name actually changed
    if [ "$new_name" != "$name" ]; then
      echo "Renaming '$entry' to '$dir/$new_name'"
      mv "$entry" "$dir/$new_name"
    fi
  done
}

echo "Renaming items containing '$OLD_CHG' → '$CHG' and '$OLD_RELEASE' → '$RELEASE_VERSION' using DFS..."
dfs_rename .
echo "Renaming complete."