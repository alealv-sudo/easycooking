import { Sequelize } from "sequelize";

const db = new Sequelize('easycooking', 'fl0user', 'FdL3fMV1CijO', {
    host: 'ep-curly-recipe-80170337.us-east-2.aws.neon.fl0.io',
    port: 5432,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false, 
        }
    },
});

export default db