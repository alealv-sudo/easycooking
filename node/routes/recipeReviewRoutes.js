import express from "express"
import RecipeReviewCTRL  from "../controllers/RecipeReviewController.js"

const router = express.Router()

router.get('/', RecipeReviewCTRL.getAllPost);
router.get('/:id', RecipeReviewCTRL.getPost);
router.post('/', RecipeReviewCTRL.createPost);
router.put('/', RecipeReviewCTRL.updatePost);
router.delete('/:id', RecipeReviewCTRL.deletePost);

export default router