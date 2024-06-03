# Cheeseria API

Backend for Cheeseria project.

## Requirements

- Node >= 18
- Docker

## Installation / Development

1. Environment Variables

   `.env.example` to `.env` and populate the required values.

2. Install depedencies

   `npm install`.

3. Start postgres service

   `docker compose up -d postgres`

4. Seed database tables

   `npm run seed`

5. Run backend in development mode

   `npm start`

6. (Optional) Run containerized backend

   `docker compose up cheeseria-api`

   - Note: the "DB_HOST" must be set to "postgres" to allow communicating between containers

## Running in Production

1. Build image from Dockerfile

   `docker image build --tag cheeseria-api .`

2. Run container from image

   `docker run --publish 8080:3000 --name cheeseria-api cheeseria-api:latest`
