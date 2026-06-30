#!/bin/bash
# push.sh - Push a directory to GitHub using token from env file
# Usage: ./push.sh [repo-name] [dir]
# Example: ./push.sh shipfast /path/to/dir

REPO_NAME="${1:-$(basename "$(pwd)")}"
SOURCE_DIR="${2:-.}"
TOKEN=$(grep "GITHUB_TOKEN" ~/.env_nullpointco | cut -d= -f2)
cd "$SOURCE_DIR" || exit 1
git init 2>/dev/null
git checkout -b main 2>/dev/null
git add -A
git commit -m "${REPO_NAME} initial commit"
git remote remove origin 2>/dev/null
git remote add origin "https://oauth2:${TOKEN}@github.com/NullPointCo/${REPO_NAME}.git"
timeout 25 git push -u origin main 2>&1
