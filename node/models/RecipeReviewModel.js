//importa la conexion a la db 
import db from "../database/db.js";

import { DataTypes } from "sequelize";

const RecipeReviewModel = db.define('recipereviewposts', {
    
    title_post:    {type: DataTypes.STRING},
    review_post:     {type: DataTypes.STRING},
    id_recipe_review: {type: DataTypes.INTEGER},
})

export default RecipeReviewModel