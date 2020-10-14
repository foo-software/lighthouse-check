FROM femtopixel/google-lighthouse:v6.4.1

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#global-npm-dependencies
# use /home/chrome because we're the "chrome" user
ENV NPM_CONFIG_PREFIX=/home/chrome/.npm-global
ENV PATH=$PATH:/home/chrome/.npm-global/bin

RUN npm install @foo-software/lighthouse-check -g

CMD ["lighthouse-check"]
