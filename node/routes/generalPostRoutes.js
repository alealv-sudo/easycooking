import express from "express"
import GeneralPostCTRL  from "../controllers/GenealPostController.js"

const router = express.Router()

router.get('/', GeneralPostCTRL.getAllPost);
router.get('/:id', GeneralPostCTRL.getPost);
router.post('/', GeneralPostCTRL.createPost);
router.put('/', GeneralPostCTRL.updatePost);
router.delete('/:id', GeneralPostCTRL.deletePost);
router.get('/user/:id', GeneralPostCTRL.getPostsByUser)

export default router