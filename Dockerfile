FROM node:latest

WORKDIR "/app"

COPY . .

RUN npm install

CMD ["node", "src/index.js"]
