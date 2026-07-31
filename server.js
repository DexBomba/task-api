import "dotenv/config";
import express from "express";
import cors from "cors";
import {pool} from "./database.js";
import animalController from "./controller.js";
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors()); 
app.use(express.json());

function formatTask(task) {
    return {
        ...task,
        completed: Boolean(task.completed),
    };
}
app.get("/", (request, response) => {
    response.json({
        message: "Animal API is running",
    });
});

app.get("/animals", animalController.getAllAnimals);
app.get("/animal/:id", animalController.getAnimalById);
app.post("/animals", animalController.createAnimal);
app.put("/animals/:id", animalController.updateAnimal);
app.delete("/animals/:id", animalController.deleteAnimal);

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL successfully");
        connection.release();
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to MySQL:", error.message);
        process.exit(1);
    }
}

startServer();