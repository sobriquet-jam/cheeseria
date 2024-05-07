import { app } from "./server";
import { getDb, initDb } from "./db";

const PORT = 3000;

async function start() {
  try {
    // Connect to db
    await initDb();

    // Start the server
    app.listen(PORT, (): void => {
      console.info(`Connected successfully on port ${PORT}`);
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
