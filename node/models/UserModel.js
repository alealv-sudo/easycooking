//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

import  ProfileModel  from "./ProfileModel.js";
import  GeneralPostModel from "./GeneralPostModel.js"

const UserModel = db.define('users',{
    userName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING}
})


/* asociación uno a uno  (usuario-perfil)  */
UserModel.hasOne(ProfileModel, {
    foreignKey: 'UserModelId',
    sourceKey: 'id'
})

ProfileModel.belongsTo(UserModel ,{
    foreignKey: 'UserModelId',
    targetKey: 'id'
})

/* asociación uno a muchos (usuario-generalpost) */

UserModel.hasMany(GeneralPostModel, {
    foreignKey: 'creatorId',
    sourceKey: 'id'
})

GeneralPostModel.belongsTo(UserModel, {
    foreignKey: 'creatorId',
    targetKey: 'id'
})
export default UserModel
