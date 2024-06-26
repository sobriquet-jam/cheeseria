import * as OpenApiValidator from "express-openapi-validator";
import express, { Application, Request, Response, NextFunction } from "express";
import { routes } from "./routes";
import corsMiddleware from "cors";
const apiSpec = "./src/openapi.yaml";

const app: Application = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
app.use(corsMiddleware());

app.use("/spec", express.static(apiSpec));
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

app.use("/", routes);

// Catch-all for unrecognised routes
app.use(function (req, res, next) {
  res.status(404).send("Route not found " + req.path);
});

export { app };
