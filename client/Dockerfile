FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .
EXPOSE 49153
CMD ["npm","run","dev"]