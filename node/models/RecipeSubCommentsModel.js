//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const RecipeSubCommentsModels = db.define('subcomments',{
    user_Id:            { type: DataTypes.INTEGER  },
    user_comment:       { type: DataTypes.STRING   },
    recipe_id:          { type: DataTypes.INTEGER  },
    
    publishDate:        { type: DataTypes.DATE     },
},{
  timestamps: false,
})

export default RecipeSubCommentsModels