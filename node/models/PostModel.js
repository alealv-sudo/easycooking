//importa la conexion a la db 
import db from "../database/db.js";

import { DataTypes } from "sequelize";

/* Import asociaciones */
import IngredientsModel from "./IngredientsModel.js";
import RatingsModel from "./RatingsModel.js";
import { defaultValueSchemable } from "sequelize/lib/utils";

/* Modelo DB */
const PostModel = db.define('recipes', {
    
    recipe_name:         { type: DataTypes.STRING   },
    image_recipe:        { type: DataTypes.STRING,   defaultValue:'1'},
    preparation_time:    { type: DataTypes.INTEGER  },
    temperature:         { type: DataTypes.INTEGER  },
    calories:            { type: DataTypes.INTEGER  },
    description:         { type: DataTypes.STRING   },
    preparation:         { type: DataTypes.STRING   },
    type_recipe:         { type: DataTypes.STRING   },
    originary:           { type: DataTypes.STRING   },
    tips:                { type: DataTypes.STRING   },

    likes:               { type: DataTypes.INTEGER  },
    publishDate:         { type: DataTypes.DATE     },
})

/* asociación uno a muchos (post(recetas)-Ingredientes) */

PostModel.hasMany(IngredientsModel, {
    foreignKey: 'recipeId',
    sourceKey: 'id',
})

IngredientsModel.belongsTo(PostModel, {
    foreignKey: 'recipeId',
    targetKey: 'id',
})

/* asociación uno a muchos (post(recetas)-ratings) */

PostModel.hasMany(RatingsModel, {
    foreignKey: 'recipeId',
    sourceKey: 'id'
})

RatingsModel.belongsTo(PostModel, {
    foreignKey: 'recipeId',
    targetKey: 'id'
})

export default PostModel