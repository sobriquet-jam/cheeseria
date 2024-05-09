# Build stage
FROM node:18-slim AS builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
COPY ./test ./test

RUN npm ci
RUN npm run build


# Production stage
FROM node:18-slim

WORKDIR /app
COPY package*.json ./

RUN npm ci --quiet --only=production

COPY --from=builder /usr/src/app/dist ./
COPY ./src/openapi.yaml ./src

EXPOSE 3000
CMD [ "node", "src/index.js" ]