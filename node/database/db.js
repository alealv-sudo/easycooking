import { Sequelize } from "sequelize";
import pg from "pg"

const db = new Sequelize('easycooking_db', 'EasyCooking', 'FdL3fMV1CijO', {
    host: 'database.cjq0m8sayf8o.us-east-1.rds.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false, 
        }
    },
});

export default db