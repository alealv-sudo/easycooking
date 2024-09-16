import express from "express"
import ratingsCTRL  from "../controllers/RatingsController.js"

const router = express.Router()

router.get('/', ratingsCTRL.getAllRatings);
router.get('/:id', ratingsCTRL.getRating);
router.get('/:userId/recipes/:recipeId', ratingsCTRL.getRatingUserRecipe);
router.post('/', ratingsCTRL.createRating);
router.put('/', ratingsCTRL.updateRating);
router.put('/Review', ratingsCTRL.updateRatingReview);
router.delete('/:id', ratingsCTRL.deleteRating);

export default router