import { Request, Response, Router } from "express";
import { randomUUID } from "crypto";
import * as model from "./model";
import { Cheese } from "./types";
import { date } from "express-openapi-validator/dist/framework/base.serdes";

const routes = Router();

// Get all cheeses
routes.get(
  "/cheeses",
  async (req: Request, res: Response): Promise<Response<Cheese[]>> => {
    const cheeses = await model.findAll();
    if (!cheeses) {
      return res.status(404).send({ message: "No cheeses to show" });
    }
    return res.status(200).send(cheeses);
  }
);

// Get a specific cheese by ID
routes.get(
  "/cheeses/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    const cheeseId = req.params.id;
    const cheese = await model.getById(cheeseId);

    if (!cheese) {
      return res.status(404).send({ message: "Cheese not found" });
    }
    return res.status(200).send(cheese);
  }
);

// Create a new cheese
routes.post(
  "/cheeses",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const newCheese = await model.create({
        name: req.body.name,
        images: Array.isArray(req.body.images)
          ? req.body.images
          : [req.body.images],
        description: req.body.description,
        pricePerKilo: req.body.pricePerKilo,
      });

      // Return the newly created cheese
      return res.status(201).json(newCheese);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating cheese";
      console.error("Error creating cheese", error);
      return res.status(500).json({ message });
    }
  }
);

// Update a specific cheese by ID
routes.put(
  "/cheeses/:id",
  async (
    req: Request<{ id: string }, undefined, Partial<Cheese>>,
    res: Response
  ): Promise<Response> => {
    const cheeseId = req.params.id;

    const cheese = await model.getById(cheeseId);
    if (!cheese) {
      return res
        .status(404)
        .send({ message: "No cheese matching the id provided" });
    }

    const { name, description, pricePerKilo, images } = req.body;

    // Check for missing fields and update them if provided
    const fieldsToUpdate: model.UpdateCheeseInput = {};
    if (name) {
      fieldsToUpdate["name"] = name;
    }
    if (description) {
      fieldsToUpdate["description"] = description;
    }
    if (pricePerKilo) {
      fieldsToUpdate["pricePerKilo"] = pricePerKilo;
    }
    if (images) {
      fieldsToUpdate["images"] = images;
    }

    try {
      model.updateCheese(cheeseId, fieldsToUpdate);
      return res.status(202).json({ message: "Cheese updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete a specific cheese by ID
routes.delete(
  "/cheeses/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    const cheeseId = req.params.id;

    try {
      await model.deleteById(cheeseId);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(404).send({ message: err?.message });
      }
    }

    return res.status(204).send();
  }
);

export { routes };
