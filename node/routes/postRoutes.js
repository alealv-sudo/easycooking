import express from "express"
import PostCTRL  from "../controllers/PostController.js"

const router = express.Router()

router.get('/paginated', PostCTRL.getPostsPaginated);
router.get('/paginatedUser', PostCTRL.getOterUserPostsPaginated);
router.get('/paginatedSelect', PostCTRL.getSelectPostsPaginated);
router.get('/:id', PostCTRL.getPost);
router.get('/', PostCTRL.getAllPost);
router.get('/user/:id',PostCTRL.getPostUser);
router.post('/', PostCTRL.createPost);
router.put('/', PostCTRL.updatePost);
router.delete('/:id', PostCTRL.deletePost);
router.get('/recipes/ingredients/:value', PostCTRL.getPostIngredientSimilar);
router.get('/recipe_name/:value', PostCTRL.getPostSimilar);

export default router