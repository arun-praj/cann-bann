FROM node:16-alpine

RUN mkdir /app && chown node:node /app
WORKDIR /app

USER node
COPY --chown=node:node package.json package-lock.json* ./

COPY package.json .

RUN npm install

COPY --chown=node:node . .

EXPOSE 49153
CMD ["npm","run","dev"]