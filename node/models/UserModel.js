//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

import  ProfileModel  from "./ProfileModel.js";
import  GeneralPostModel from "./GeneralPostModel.js"
import PostModel from "./PostModel.js"; 
import RatingsModel from "./RatingsModel.js";

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

/* asociación uno a muchos (usuario-postModel(Recetas)) */

UserModel.hasMany(PostModel, {
    foreignKey: 'creatorId',
    sourceKey: 'id'
})

PostModel.belongsTo(UserModel, {
    foreignKey: 'creatorId',
    targetKey: 'id'
})

/* asociación uno a muchos (usuario-ratings) */

UserModel.hasMany(RatingsModel, {
    foreignKey: 'userId',
    sourceKey: 'id'
})

RatingsModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'id'
})
export default UserModel
