import express from "express"
import FavoriteRecipeCTRL from "../controllers/FavoriteRecipeController.js";

const router = express.Router()

router.get('/', FavoriteRecipeCTRL.getAllFavorites);
router.get('/paginated', FavoriteRecipeCTRL.getPostsPaginated);
router.get('/paginatedUser', FavoriteRecipeCTRL.getOterUserFavsPaginated);
router.get('/:id', FavoriteRecipeCTRL.getFavorite);
router.get('/alluser/:id', FavoriteRecipeCTRL.getUserFavorites);
router.post('/', FavoriteRecipeCTRL.createFavorite);
router.put('/', FavoriteRecipeCTRL.updateFavorite);
router.delete('/:id', FavoriteRecipeCTRL.deleteFavorite);
router.post('/like', FavoriteRecipeCTRL.handleLikeClicked);
router.post('/fav', FavoriteRecipeCTRL.handleFavClicked);

export default router