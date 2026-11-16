#!/usr/bin/env bash
# Publish site/ to the gh-pages branch (served by GitHub Pages).
set -euo pipefail
cd "$(dirname "$0")/.."
git subtree split --prefix site -b gh-pages-tmp
git -c push.negotiate=true push -f origin gh-pages-tmp:gh-pages
git branch -D gh-pages-tmp
echo "Deployed. GitHub Pages updates within ~1 minute."
