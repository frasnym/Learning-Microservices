FROM node:alpine

RUN npm install -g npm@7.6.0

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD [ "npm", "start" ]