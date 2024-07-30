//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

const FavoriteRecipeModel = db.define('favorites',{
},{
    timestamps: false,
})

export default FavoriteRecipeModel