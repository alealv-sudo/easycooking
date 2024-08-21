//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const FollowerModels = db.define('followers',{
   
},{
  timestamps: false,
})

export default FollowerModels