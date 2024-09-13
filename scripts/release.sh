#!/bin/bash
set -e

npm run build
VERSION=$(node -p "require('./package.json').version")

CHANGELOG_CONTENT=$(cat docs/CHANGELOG.md)
git add .
git commit -m "chore: release version ${VERSION}"
git push origin main --tags
git tag -a "v${VERSION}" -m "Release ${VERSION}: ${CHANGELOG_CONTENT}"
npm publish --access public