# This Dockerfile builds the API package

# Stage 0 to build the API package
FROM node:lts-alpine AS builder

USER node
WORKDIR /home/node/API

COPY --chown=node:node package.json lerna.json /home/node/API/
COPY --chown=node:node packages/api/package.json packages/api/tsconfig.json ./packages/api/

RUN yarn install

COPY --chown=node:node packages/api/src ./packages/api/src/
RUN yarn workspace @orion/api build

# Stage 1 to consume the build artifacts and "containerize" the API package
FROM node:lts-alpine

USER node
WORKDIR /home/node/API

COPY --chown=node:node package.json lerna.json /home/node/API/
COPY --chown=node:node packages/api/package.json ./packages/api/

RUN yarn install --production

COPY --from=builder /home/node/API/packages/api/dist packages/api/dist/

EXPOSE 3000

CMD ["node", "packages/api/dist/index.js"]
