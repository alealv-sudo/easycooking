import express from "express"
import PostCTRL  from "../controllers/PostController.js"

const router = express.Router()

router.get('/', PostCTRL.getAllPost);
router.get('/:id', PostCTRL.getPost);
router.post('/', PostCTRL.createPost);
router.put('/:id', PostCTRL.updatePost);
router.delete('/:id', PostCTRL.deletePost);

export default router