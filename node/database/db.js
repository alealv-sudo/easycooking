import { Sequelize } from "sequelize";

const db = new Sequelize('proyecto_x', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db