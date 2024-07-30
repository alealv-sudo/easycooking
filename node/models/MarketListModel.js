//importa la conexion a la db 
import  db  from "../database/db.js";
import { DataTypes } from "sequelize";

const MarketListsModel = db.define('marketlists',{
    list_title: {type: DataTypes.STRING}
},{
    timestamps: false,
})

export default MarketListsModel