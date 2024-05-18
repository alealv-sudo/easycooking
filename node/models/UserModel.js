//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const UserModel = db.define('users',{
    userName: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING}
})

export default UserModel
