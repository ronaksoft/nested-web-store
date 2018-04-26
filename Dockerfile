FROM mhart/alpine-node:latest

MAINTAINER Barbar Startup Factory hey@barbar.com.tr

WORKDIR /app
ADD . .

RUN npm install

EXPOSE 8899

CMD ["npm", "run", "start:prod"]
