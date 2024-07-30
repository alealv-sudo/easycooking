//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

const ListItemModel = db.define('listitems',{
    ingredient: {type: DataTypes.STRING},
},{
    timestamps: false,
})

export default ListItemModel