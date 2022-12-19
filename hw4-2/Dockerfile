FROM node:18 as build-stage

# WORKDIR /app

ENV APPLICATION_NAME=gb-app
ENV SASS_BINARY_PATH=/opt/$APPLICATION_NAME/bin/vendor/linux-x64/binding.node
WORKDIR /opt/$APPLICATION_NAME


COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

# ENV FASTIFY_ADDRESS 0.0.0.0

# RUN npm run build
RUN npm run start
RUN npm prune --production

FROM node:18-alpine as production-stage

ENV APPLICATION_NAME=gb-app
ENV NODE_ENV=production
WORKDIR /opt/$APPLICATION_NAME

COPY --from=build-stage /opt/$APPLICATION_NAME/node_modules /opt/$APPLICATION_NAME/node_modules
COPY --from=build-stage /opt/$APPLICATION_NAME/dist/ /opt/$APPLICATION_NAME/start.sh /opt/$APPLICATION_NAME/


EXPOSE 3001

CMD ["node", "apps/api/main.js"]
