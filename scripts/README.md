# Usage

Publish a tag that matches latest major package version. Make sure to update this line of the Dockerfile: `RUN npm install @foo-software/lighthouse-check@10 -g`. We also publish a "latest" tag.

- `./scripts/docker-publish.sh -v 10`
- `./scripts/docker-publish.sh -v latest`
