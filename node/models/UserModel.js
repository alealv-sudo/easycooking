// Import the connection to the database
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UserModel = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    }
});

export default UserModel;
