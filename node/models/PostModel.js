//importa la conexion a la db 
import db from "../database/db.js";

import { DataTypes } from "sequelize";

/* Modelo DB */
const PostModel = db.define('recipes', {
    
    recipe_name:         { type: DataTypes.STRING   },
    image_recipe:        { type: DataTypes.STRING,   defaultValue:'1'},
    preparation_time:    { type: DataTypes.STRING  },
    temperature:         { type: DataTypes.STRING  },
    calories:            { type: DataTypes.STRING  },
    description:         { type: DataTypes.STRING(800)   },
    preparation:         { type: DataTypes.STRING(2500), },
    type_recipe:         { type: DataTypes.STRING   },
    originary:           { type: DataTypes.STRING   },
    tips:                { type: DataTypes.STRING(600)   },

    likes:               { type: DataTypes.INTEGER, defaultValue: 0, },
    publishDate:         { type: DataTypes.DATE     },
})

export default PostModel