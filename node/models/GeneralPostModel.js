//importa la conexion a la db 
import db from "../database/db.js";

import { DataTypes } from "sequelize";

const GeneralPostModel = db.define('generalposts', {
    
    titel_post:    {type: DataTypes.STRING   },
    text_post:     {type: DataTypes.STRING   },
    image_post_id: {type: DataTypes.STRING,  defaultValue: '1' },
})

export default GeneralPostModel