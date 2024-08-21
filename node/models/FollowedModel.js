//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const FollowedModels = db.define('followeds',{
   
},{
  timestamps: false,
})

export default FollowedModels