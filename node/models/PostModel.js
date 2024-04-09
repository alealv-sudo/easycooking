//importa la conexion a la db 
import db from "../database/db.js";

import { DataTypes } from "sequelize";

const PostModel = db.define('recipes', {
    
    recipe_name:         { type: DataTypes.STRING   },
    image_recipe:        { type: DataTypes.BLOB     },
    preparation_time:    { type: DataTypes.INTEGER  },
    temperature:         { type: DataTypes.INTEGER  },
    calories:            { type: DataTypes.INTEGER  },
    description:         { type: DataTypes.STRING   },
    ingredients:         { type: DataTypes.STRING   },
    preparation:         { type: DataTypes.STRING   },
    type_recipe:         { type: DataTypes.STRING   },
    originary:           { type: DataTypes.STRING   },
    tips:                { type: DataTypes.STRING   },

    creator_code:        { type: DataTypes.INTEGER  }
})

export default PostModel