import express from "express"
import ratingsCTRL  from "../controllers/RatingsController.js"

const router = express.Router()

router.get('/', ratingsCTRL.getAllRatings);
router.get('/:id', ratingsCTRL.getRating);
router.post('/', ratingsCTRL.createRating);
router.put('/', ratingsCTRL.updateRating);
router.delete('/:id', ratingsCTRL.deleteRating);

export default router