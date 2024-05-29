//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";
import UserModel from "./UserModel.js";

const FollowsModels = db.define('follows',{
    followerId: {type: DataTypes.INTEGER,
        references: {
          model: UserModel,
          key: 'id'
        }},
    followedId: {type: DataTypes.INTEGER,
        references: {
          model: UserModel,
          key: 'id'
        }},
})

export default FollowsModels