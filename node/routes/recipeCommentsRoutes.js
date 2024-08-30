import express from "express"
import RecipeCommentsCTRL from "../controllers/RecipeCommentsController.js"

const recipeCommentsRoutes = express.Router()

recipeCommentsRoutes.get('/', RecipeCommentsCTRL.getAllRecipeComments)
recipeCommentsRoutes.get('/:id', RecipeCommentsCTRL.getRecipeComments)
recipeCommentsRoutes.post('/', RecipeCommentsCTRL.createRecipeComments)
recipeCommentsRoutes.put('/:id', RecipeCommentsCTRL.updateRecipeComments)
recipeCommentsRoutes.delete('/:id', RecipeCommentsCTRL.deleteRecipeComments)

export default recipeCommentsRoutes