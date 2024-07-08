//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

import  ProfileModel  from "./ProfileModel.js";

const UserModel = db.define('users',{
    userName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING}
})

UserModel.hasOne(ProfileModel, {
    foreignKey: 'UserModelId',
    sourceKey: 'id'
})

ProfileModel.belongsTo(UserModel ,{
    foreignKey: 'UserModelId',
    targetKey: 'id'
})

export default UserModel
