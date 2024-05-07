# Usage

Publish a tag that matches latest major package version. Make sure to update this line of the Dockerfile: `RUN npm install @foo-software/lighthouse-check@10 -g`. We also publish a "latest" tag.

- `./scripts/docker-publish.sh -v 10`
- `./scripts/docker-publish.sh -v latest`

# Test `Dockerfile`

Build the test image

```bash
docker build --no-cache --platform=linux/amd64 --tag "lighthouse-check-test" .
```

Run it

```bash
docker run lighthouse-check-test lighthouse-check --urls "https://www.foo.software"
```
