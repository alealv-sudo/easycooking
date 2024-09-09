import express from "express"
import FollowerCTRL from "../controllers/FollowerController.js"

const followerRoutes = express.Router()

followerRoutes.get('/', FollowerCTRL.getAllFollowers)
followerRoutes.get('/paginated', FollowerCTRL.getFollowerPaginated);
followerRoutes.get('/:id', FollowerCTRL.getFollower)
followerRoutes.post('/', FollowerCTRL.createFollower)
followerRoutes.put('/:id', FollowerCTRL.updateFollower)
followerRoutes.delete('/:id', FollowerCTRL.deleteFollower)

export default followerRoutes