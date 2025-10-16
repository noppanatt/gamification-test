#FROM node:18-alpine
#WORKDIR /app
#COPY package*.json ./
#RUN npm ci
#COPY . .
#EXPOSE 3000
#CMD [ "npm", "start" ]
FROM node:20
RUN mkdir /usr/app
WORKDIR /usr/app
ARG SOURCE_COMMIT
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN apt-get install tzdata
ENV TZ=Asia/Bangkok
RUN chown -R node:node /usr/app
USER node
COPY --chown=node:node ./package.json ./package-lock.json ./
RUN npm install
EXPOSE 3000
ENV SOURCE_COMMIT $SOURCE_COMMIT
COPY --chown=node:node ./ .
ENV NODE_ENV=production
CMD [ "npm", "start" ]