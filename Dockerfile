# inspired by https://github.com/rastasheep/alpine-node-chromium/blob/master/12-alpine/Dockerfile
FROM node:14.15.0-alpine3.12

LABEL maintainer "Foo <hello@foo.software>"

RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache update \
  && apk --no-cache upgrade \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium \
  && rm -rf /var/cache/apk/* /tmp/*

ENV CHROME_BIN /usr/bin/chromium-browser
ENV LIGHTHOUSE_CHROMIUM_PATH /usr/bin/chromium-browser

RUN chromium-browser --product-version

RUN npm install @foo-software/lighthouse-check@2.0.0-0 -g

CMD ["lighthouse-check"]
