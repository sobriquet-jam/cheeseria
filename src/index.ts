import * as OpenApiValidator from "express-openapi-validator";
import express, { Application } from "express";
import { routes } from "./routes";

const PORT = 3000;

const apiSpec = "./src/openapi.yaml";

const app: Application = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use("/spec", express.static(apiSpec));
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

app.use("/", routes);

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
