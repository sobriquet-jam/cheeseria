import { Request, Response, Router } from "express";
import { randomUUID } from "crypto";
import * as model from "./model";
import { Cheese } from "./types";

const routes = Router();

// Get all cheeses
routes.get(
  "/cheeses",
  async (req: Request, res: Response): Promise<Response<Cheese[]>> => {
    const cheeses = model.findAll();
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
    const cheese = model.getById(cheeseId);

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
      const newCheese = model.create({
        id: randomUUID(),
        name: req.body.name,
        images: Array.isArray(req.body.images)
          ? req.body.images
          : [req.body.images],
        description: req.body.description,
        pricePerKilo: req.body.price_per_kilo,
      });

      // Return the newly created cheese
      return res.status(201).json(newCheese);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
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

    const cheese = model.getById(cheeseId);
    if (!cheese) {
      return res.status(404).send({ message: "Cheese not found" });
    }

    try {
      const { name, description, pricePerKilo, images } = req.body;
      if (name !== undefined) {
        cheese.name = name;
      }
      if (description !== undefined) {
        cheese.description = description;
      }
      if (pricePerKilo !== undefined) {
        cheese.pricePerKilo = pricePerKilo;
      }
      if (images !== undefined) {
        cheese.images = images;
      }

      // Return the updated cheese
      return res.status(200).json(cheese);
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
      model.deleteById(cheeseId);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(404).send({ message: err?.message });
      }
    }

    return res.status(204).send();
  }
);

export { routes };
