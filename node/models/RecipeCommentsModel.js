//importa la conexion a la db 
import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const RecipeCommentsModels = db.define('comments',{
    user_Id:            { type: DataTypes.INTEGER  },
    user_comment:       { type: DataTypes.STRING   },
    recipe_id:          { type: DataTypes.INTEGER  },
    haveSubcoments:     { type: DataTypes.INTEGER  },
    publishDate:        { type: DataTypes.DATE     },
},{
  timestamps: false,
})

export default RecipeCommentsModels