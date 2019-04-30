FROM node:alpine

WORKDIR /usr/src/app

RUN npm install yarn -g
COPY ../.. /usr/src/app

RUN yarn install
CMD npm start serve
