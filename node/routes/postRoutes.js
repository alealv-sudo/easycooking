import express from "express"
import PostCTRL  from "../controllers/PostController.js"

const router = express.Router()

router.get('/', PostCTRL.getAllPost);
router.get('/:id', PostCTRL.getPost);
router.get('/user/:id',PostCTRL.getPostUser);
router.post('/', PostCTRL.createPost);
router.put('/', PostCTRL.updatePost);
router.delete('/:id', PostCTRL.deletePost);

export default router