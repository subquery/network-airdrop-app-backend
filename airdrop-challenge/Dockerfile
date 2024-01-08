FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY ./ ./

RUN rm -rf node_modules
RUN yarn install --prod --link-duplicates
RUN yarn build


FROM node:18-alpine

RUN apk add --no-cache curl grep

WORKDIR /usr/src/app

# Copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist

ENTRYPOINT [ "node", "dist/src/index.js" ]
