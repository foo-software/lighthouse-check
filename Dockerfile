# inspired by https://github.com/Zenika/alpine-chrome/blob/master/Dockerfile
FROM node:14.15.0-alpine3.12

LABEL maintainer "Foo <hello@foo.software>"

# latest Chromium package
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/v3.12/main" >> /etc/apk/repositories \
  && apk upgrade -U -a \
  && apk add \
  libstdc++ \
  chromium \
  harfbuzz \
  nss \
  freetype \
  ttf-freefont \
  font-noto-emoji \
  wqy-zenhei \
  && rm -rf /var/cache/* \
  && mkdir /var/cache/apk

COPY local.conf /etc/fonts/local.conf

# Add Chrome as a user
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser \
  CHROME_PATH=/usr/lib/chromium/

RUN chromium-browser --product-version

RUN npm install @foo-software/lighthouse-check -g

CMD ["lighthouse-check"]
