import dotenv from "dotenv";

dotenv.config();

// Check all env vars are present
for (const envVar of [
  "API_HOST",
  "API_PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASS",
]) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable "${envVar}"`);
  }
}

export const API_HOST = process.env.API_HOST;
export const API_PORT = process.env.API_PORT;

// Compose database URL from environment params
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
export const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
