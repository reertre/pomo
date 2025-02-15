#!/usr/bin/env bash
#
# DFS Rename Script
# Replaces OLD_CHG with CHG, and OLD_RELEASE with RELEASE_VERSION in file/directory names
#

# --- CONFIGURATION ---
RELEASE_VERSION="3.0"
CHG="CHG181272245"

OLD_CHG="CHG999999999"
OLD_RELEASE="release_99.9"

# Make sure the required variables are set
if [ -z "$CHG" ] || [ -z "$RELEASE_VERSION" ]; then
  echo "ERROR! Both CHG and RELEASE_VERSION must be defined."
  exit 1
fi

# --- DFS FUNCTION ---
dfs_rename() {
  local path="$1"

  # Recurse into subdirectories first (bottom-up)
  for entry in "$path"/*; do
    [ -e "$entry" ] || continue
    if [ -d "$entry" ]; then
      dfs_rename "$entry"
    fi
  done

  # Rename items (files/directories) in the current directory
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