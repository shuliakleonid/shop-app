FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json  yarn.lock ./
COPY prisma/ ./prisma/


RUN yarn install

COPY . .
RUN yarn remove bcrypt
RUN yarn add bcrypt
RUN yarn prisma generate --schema=prisma/schema.prisma

RUN yarn build shopping-cart

CMD sh -c "node ./dist/apps/shopping-cart/main"
