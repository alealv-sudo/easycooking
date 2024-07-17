import express from "express"
import IngredientsCTRL  from "../controllers/IngredientsController.js"

const router = express.Router()

router.get('/', IngredientsCTRL.getAllIngredients);
router.get('/:id', IngredientsCTRL.getIngredient);
router.post('/', IngredientsCTRL.createIngredient);
router.put('/', IngredientsCTRL.updateIngredient);
router.delete('/:id', IngredientsCTRL.deleteIngredient);

export default router