import express from "express"
import FavoriteRecipeCTRL from "../controllers/FavoriteRecipeController.js";

const router = express.Router()

router.get('/', FavoriteRecipeCTRL.getAllFavorites);
router.get('/:id', FavoriteRecipeCTRL.getFavorite);
router.get('/alluser/:id', FavoriteRecipeCTRL.getUserFavorites);
router.post('/', FavoriteRecipeCTRL.createFavorite);
router.put('/', FavoriteRecipeCTRL.updateFavorite);
router.delete('/:id', FavoriteRecipeCTRL.deleteFavorite);

export default router