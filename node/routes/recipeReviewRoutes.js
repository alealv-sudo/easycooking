import express from "express"
import RecipeReviewCTRL  from "../controllers/RecipeReviewController.js"

const router = express.Router()

router.get('/paginatedUser', RecipeReviewCTRL.getUserPostsPaginated);
router.get('/:id', RecipeReviewCTRL.getPost);
router.get('/', RecipeReviewCTRL.getAllPost);
router.post('/', RecipeReviewCTRL.createPost);
router.put('/', RecipeReviewCTRL.updatePost);
router.delete('/:id', RecipeReviewCTRL.deletePost);
router.get('/user/:id', RecipeReviewCTRL.getPostByUser);
router.get('/review_name/:value', RecipeReviewCTRL.getPostSimilar);

export default router