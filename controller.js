import {pool} from "./database.js";
import { AnimalModel } from "./model.js";


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

export default {getAllAnimals};