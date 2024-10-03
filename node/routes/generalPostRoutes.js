import express from "express"
import GeneralPostCTRL  from "../controllers/GenealPostController.js"

const router = express.Router()

router.get('/paginatedUser', GeneralPostCTRL.getUserPostsPaginated);
router.get('/:id', GeneralPostCTRL.getPost);
router.get('/', GeneralPostCTRL.getAllPost);
router.post('/', GeneralPostCTRL.createPost);
router.put('/', GeneralPostCTRL.updatePost);
router.delete('/:id', GeneralPostCTRL.deletePost);
router.get('/user/:id', GeneralPostCTRL.getPostsByUser)
router.get('/general_post_name/:value', GeneralPostCTRL.getPostSimilar);

export default router