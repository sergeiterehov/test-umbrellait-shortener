FROM node:alpine

COPY ./app /var/app

WORKDIR /var/app

RUN npm install --only=production
RUN npm run build

ENTRYPOINT [ "npm", "start" ]