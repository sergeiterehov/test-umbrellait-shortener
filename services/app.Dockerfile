FROM node:alpine

COPY ./app /var/app

WORKDIR /var/app

RUN npm install --only=production
RUN npm run build

RUN echo "* * * * * wget -qO- localhost:1337/cache/flush-counters" >> /etc/crontabs/root
RUN echo "0 * * * * wget -qO- localhost:1337/links/delete-old" >> /etc/crontabs/root

ENTRYPOINT crond -b && npm start