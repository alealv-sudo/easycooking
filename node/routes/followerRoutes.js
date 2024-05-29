import express from "express"
import followsCTRL from "../controllers/FollowController.js"

const followerRoutes = express.Router()

followerRoutes.get('/', followsCTRL.getAllBlogs)
followerRoutes.get('/:id', followsCTRL.getBlog)
followerRoutes.post('/', followsCTRL.createBlog)
followerRoutes.put('/:id', followsCTRL.updateBlog)
followerRoutes.delete('/:id', followsCTRL.deleteBlog)

export default followerRoutes