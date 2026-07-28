require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database");
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

app.get("/animals", async (req, res) => {
    try {
        const { numLegs } = req.query;
        let sql = "SELECT * FROM animals";
        const params = [];

        if (numLegs !== undefined) {
            sql += " WHERE numLegs = ?";
            params.push(numLegs);
        }

        const [rows] = await pool.execute(sql, params);
        res.json({ animals: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to retrieve animals" });
    }
});

app.get("/animal/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [rows] = await pool.execute("SELECT * FROM animals WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to retrieve animal" });
    }
});

app.post("/animals", async (req, res) => {
    try {
        const { name, numLegs } = req.body;
        if (!name || numLegs === undefined) {
            return res.status(400).json({ message: "name and numLegs are required" });
        }
        const [result] = await pool.execute(
            "INSERT INTO animals (name, numLegs) VALUES (?, ?)",
            [name.toUpperCase(), numLegs]
        );
        const [rows] = await pool.execute("SELECT * FROM animals WHERE id = ?", [result.insertId]);

        res.status(201).json({
            message: "You added an animal",
            animal: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to add animal" });
    }
});

app.put("/animals/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, numLegs } = req.body;

        const [existing] = await pool.execute("SELECT * FROM animals WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }
        const updates = [];
        const params = [];

        if (name !== undefined) {
            updates.push("name = ?");
            params.push(name.toUpperCase());
        }
        if (numLegs !== undefined) {
            updates.push("numLegs = ?");
            params.push(numLegs);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        params.push(id);
        const sql = `UPDATE animals SET ${updates.join(", ")} WHERE id = ?`;
        await pool.execute(sql, params);

        const [rows] = await pool.execute("SELECT * FROM animals WHERE id = ?", [id]);
        res.json({
            message: "Animal updated",
            animal: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to update animal" });
    }
});

app.delete("/animals/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [result] = await pool.execute("DELETE FROM animals WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json({ message: "Animal deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to delete animal" });
    }
});

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