import { app } from "./server";

const PORT = 3000;

// Start the server
try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (err) {
  if (!(err instanceof Error)) {
    throw err;
  }
  console.error(`Error occurred: ${err.message}`);
}
