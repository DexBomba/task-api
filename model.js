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
    }   
