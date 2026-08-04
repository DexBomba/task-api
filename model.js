export class AnimalModel { 
    constructor(pool) {
        this.pool = pool
     }

    async getAllAnimals(userId, numLegs) {
         let sql = "SELECT * FROM animals WHERE user_id = ?";
        const params = [userId];

        if (numLegs !== undefined) {
            sql += " AND numLegs = ?";
            params.push(numLegs);
        }
        const [rows] = await this.pool.execute(sql, params);
        return rows;
     }
     async getAnimalById(id, userId) {
        const [rows] = await this.pool.execute(
            "SELECT * FROM animals WHERE id = ? AND user_id = ?",
            [id, userId]
        );
        return rows[0];
    }
    async createAnimal(name, numLegs, userId) {
        const [result] = await this.pool.execute(
            "INSERT INTO animals (name, numLegs, user_id) VALUES (?, ?, ?)",
            [name, numLegs, userId]
        );
        return result.insertId;
    }
    async updateAnimal(id, fields, userId) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return false;

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const values = keys.map((key) => fields[key]);
        values.push(id, userId);

        const sql = `UPDATE animals SET ${setClause} WHERE id = ? AND user_id = ?`; 
        const [result] = await this.pool.execute(sql, values);
        return result.affectedRows > 0;
    }
    async deleteAnimal(id, userId) {
        const [result] = await this.pool.execute(
            "DELETE FROM animals WHERE id = ? AND user_id = ?",
            [id, userId]
        );
        return result.affectedRows > 0;
    }
}