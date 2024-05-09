import { app } from "./server";
import { initDb } from "./db";
import { API_HOST, API_PORT } from "./environment";

async function start() {
  try {
    // Connect to db
    await initDb();

    // Start the server
    app.listen(API_PORT, (): void => {
      console.info(`API server started on ${API_HOST}:${API_PORT}`);
    });
  } catch (err) {
    if (!(err instanceof Error)) {
      console.error(`Unknown error`, err);
      throw err;
    }
    console.error(`Error occurred: ${err.message}`);
  }
}

// IIFE to allow async/await
(async () => {
  await start();
})();
