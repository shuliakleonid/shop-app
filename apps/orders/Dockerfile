FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json  yarn.lock ./
COPY prisma/ ./prisma/

RUN yarn install

COPY . .

RUN yarn remove bcrypt
RUN yarn add bcrypt
RUN yarn build orders
RUN yarn prisma generate --schema=prisma/schema.prisma

#EXPOSE 5001

CMD sh -c "node ./dist/apps/orders/main"
