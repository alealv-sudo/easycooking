//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const IngredientsModel = db.define('Ingredients',{
    ingredient: {type: DataTypes.STRING},
},{
    timestamps: false,
})

export default IngredientsModel