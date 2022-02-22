FROM node:16 AS development

WORKDIR /alexander/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

EXPOSE 3000

##################
## PRODUCTION
##################

FROM node:16 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /alexander/src/app

COPY --from=development /alexander/src/app .

EXPOSE 3000

CMD [ "node", "dist/main"]