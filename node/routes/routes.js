import express from "express"
import blogCTRL  from "../controllers/BlogController.js"

const router = express.Router()

router.get('/', blogCTRL.getAllBlogs)
router.get('/:id', blogCTRL.getBlog)
router.post('/', blogCTRL.createBlog)
router.put('/:id', blogCTRL.updateBlog)
router.delete('/:id', blogCTRL.deleteBlog)

export default router