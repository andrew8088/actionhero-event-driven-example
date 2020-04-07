FROM node:10.15.0

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
RUN ls

EXPOSE 8080

CMD ["node", "./dist/server.js"]
