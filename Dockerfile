FROM node:16-alpine as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . /usr/app/
RUN npm run build

FROM node:16-alpine as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./dist
RUN npm install

FROM node:16-alpine
WORKDIR /usr/app
RUN chown -R node:node /usr/app
USER node
RUN mkdir -p /usr/app/dist/uploads
COPY --from=ts-remover  /usr/app ./
COPY ecosystem.config.js /usr/app/
EXPOSE 3333

CMD ["npm", "run", "start:prod"]