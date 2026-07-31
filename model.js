export class AnimalModel { 
    constructor(pool) {
        this.pool = pool
     }

    async getAllAnimals(numLegs) {
         let sql = "SELECT * FROM animals";
        const params = [];

        if (numLegs !== undefined) {
            sql += " WHERE numLegs = ?";
            params.push(numLegs);
        }
        const rows = await this.pool.execute(sql, params);
        return rows[0];
     }
     async getAnimalById(id) {
        const [rows] = await this.pool.execute(
            "SELECT * FROM animals WHERE id = ?",
            [id]
        );
        return rows[0];
    }
    async createAnimal(name, numLegs) {
        const [result] = await this.pool.execute(
            "INSERT INTO animals (name, numLegs) VALUES (?, ?)",
            [name, numLegs]
        );
        return result.insertId;
    }
    async updateAnimal(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return false;

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const values = keys.map((key) => fields[key]);
        values.push(id);

        const sql = `UPDATE animals SET ${setClause} WHERE id = ?`;
        const [result] = await this.pool.execute(sql, values);
        return result.affectedRows > 0;
    }
    async deleteAnimal(id) {
        const [result] = await this.pool.execute(
            "DELETE FROM animals WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
}