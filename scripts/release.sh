#!/bin/bash
set -e
npm run build
VERSION=$(node -p "require('./package.json').version")
CHANGELOG_CONTENT=$(awk "/## \\[$VERSION\\]/{flag=1;next}/^## /{flag=0}flag" docs/CHANGELOG.md)
FORMATTED_CHANGELOG=$(echo "${CHANGELOG_CONTENT}" | sed -E 's/^### /#### /g; s/^### //g; s/^### /###\n### /g')
OUTPUT="\\n ## [${VERSION}] - $(date +%Y-%m-%d)\\n\\n### Changelog\\n\\n${FORMATTED_CHANGELOG}\\n"
echo -e "${OUTPUT}"

npm publish --access public
git tag -a "v${VERSION}" -m "Release ${VERSION}: \\n ${OUTPUT}"
git add .
git commit -m "chore: release version ${VERSION}"
git push origin main --tags
echo "Release ${VERSION} completed successfully!"
