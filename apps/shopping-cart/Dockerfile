FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json  yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build shopping-cart

#EXPOSE 5001

CMD sh -c "node ./dist/apps/shopping-cart/main"
