//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const ListCalendarModel = db.define('listCalendar',{
    day: {type: DataTypes.STRING},
},{
    timestamps: false,
})

export default ListCalendarModel