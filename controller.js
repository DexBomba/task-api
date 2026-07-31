import {pool} from "./database.js";
import { AnimalModel } from "./model.js";
const animalModel = new AnimalModel(pool);

const getAllAnimals = async (req, res) => {
    try { const animalModel = new AnimalModel(pool);
        const { numLegs } = req.query;
        const rows = await animalModel.getAllAnimals(numLegs)
        res.json({ animals: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to retrieve animals" });
    }
} 

const getAnimalById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const animal = await animalModel.getAnimalById(id);

        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json(animal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to retrieve animal" });
    }
};

const createAnimal = async (req, res) => {
    try {
        let { name, numLegs } = req.body;

        if (!name || numLegs === undefined) {
            return res.status(400).json({ message: "name and numLegs are required" });
        }
        name = name.toUpperCase();

        const insertId = await animalModel.createAnimal(name, numLegs);
        const newAnimal = await animalModel.getAnimalById(insertId);

        res.status(201).json({
            message: "You added an animal",
            animal: newAnimal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to add animal" });
    }
};

const updateAnimal = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, numLegs } = req.body;
        const existing = await animalModel.getAnimalById(id);
        if (!existing) {
            return res.status(404).json({ message: "Animal not found" });
        }
        const fields = {};
        if (name !== undefined) fields.name = name.toUpperCase();
        if (numLegs !== undefined) fields.numLegs = numLegs;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        await animalModel.updateAnimal(id, fields);
        const updatedAnimal = await animalModel.getAnimalById(id);

        res.json({
            message: "Animal updated",
            animal: updatedAnimal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to update animal" });
    }
};

const deleteAnimal = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleted = await animalModel.deleteAnimal(id);

        if (!deleted) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json({ message: "Animal deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to delete animal" });
    }
};

export default {
    getAllAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
};