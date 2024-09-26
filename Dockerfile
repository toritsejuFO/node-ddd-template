FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
ADD prisma prisma

RUN apk add --no-cache python3 make g++ \
  && rm -rf /var/cache/apk/*
RUN npm install

COPY . .
RUN npm run build

RUN apk del python3 make g++

EXPOSE 4300

ENTRYPOINT [ "npm", "start" ]
