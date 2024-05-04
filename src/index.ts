import * as OpenApiValidator from "express-openapi-validator";
import express, { Application, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { randomUUID } from 'crypto';

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

type Cheese = {
  id: string;
  name: string;
  images: string[];
  description: string;
  pricePerKilo: number;
};

type CheeseRecord = {
  id: string;
  name: string;
  images: string[];
  description: string;
  price_per_kilo: number;
};

// Read cheeses data from JSON file
const cheesesData = fs.readFileSync(
  path.join(__dirname, "cheeses.json"),
  "utf8"
);
const cheeseRecords: CheeseRecord[] = JSON.parse(cheesesData);
let cheeses: Cheese[] = cheeseRecords.map(
  ({ id, name, images, description, price_per_kilo }) => ({
    id,
    name,
    images,
    description,
    pricePerKilo: price_per_kilo,
  })
);

// Get all cheeses
app.get(
  "/cheeses",
  async (req: Request, res: Response): Promise<Response<Cheese[]>> => {
    if (!cheeses) {
      return res.status(404).send({ message: "No cheeses to show" });
    }
    return res.status(200).send(cheeses);
  }
);

// Get a specific cheese by ID
app.get(
  "/cheeses/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    const cheeseId = req.params.id;
    const cheese = cheeses.find((cheese) => cheese.id === cheeseId);

    if (!cheese) {
      return res.status(404).send({ message: "Cheese not found" });
    }
    return res.status(200).send(cheese);
  }
);

// Create a new cheese
app.post("/cheeses", async (req: Request, res: Response): Promise<Response> => {
  try {
    const newCheese: Cheese = {
      id: randomUUID(),
      name: req.body.name,
      images: Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images],
      description: req.body.description,
      pricePerKilo: req.body.price_per_kilo,
    };

    cheeses.push(newCheese);

    // Return the newly created cheese
    return res.status(201).json(newCheese);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update a specific cheese by ID
app.put(
  "/cheeses/:id",
  async (req: Request<{ id: string }, undefined, Partial<Cheese>>, res: Response): Promise<Response> => {
    const cheeseId = req.params.id;

    const cheese = getCheese(cheeseId);
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
app.delete(
  "/cheeses/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    const cheeseId = req.params.id;
    const cheese = getCheese(cheeseId);
    if (!cheese) {
      return res.status(404).send({ message: "Cheese not found" });
    }

    cheeses = cheeses.filter((c) => c.id !== cheeseId);

    return res.status(204).send();
  }
);

function getCheese(cheeseId: string): Cheese | undefined {
  return cheeses.find((cheese) => cheese.id === cheeseId);
}

// Start the server
try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
