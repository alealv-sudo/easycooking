//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

const RatingsModel = db.define('ratings',{
    score: {type: DataTypes.FLOAT},
},{
    timestamps: false
})

export default RatingsModel