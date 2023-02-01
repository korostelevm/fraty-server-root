FROM node:16-alpine
WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN apk update && apk add git
RUN apk add --no-cache bash
COPY . .
RUN yarn 
RUN yarn tsc
EXPOSE 5000
CMD ["node", "dist/src/server.js"]