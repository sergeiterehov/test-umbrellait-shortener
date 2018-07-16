FROM node:alpine

COPY ./app /var/app

WORKDIR /var/app

RUN npm install

ENTRYPOINT [ "npm", "start" ]