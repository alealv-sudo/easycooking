//importa la conexion a la db 
import db from "../database/db.js";

import { DataTypes } from "sequelize";

const RecipeReviewModel = db.define('recipereviewposts', {
    
    title_post:    {type: DataTypes.STRING},
    review_post:     {type: DataTypes.STRING},
})

export default RecipeReviewModel