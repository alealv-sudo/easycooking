import express from "express"
import FollowedCTRL from "../controllers/FollowedController.js"

const followedRoutes = express.Router()

followedRoutes.get('/', FollowedCTRL.getAllFolloweds)
followedRoutes.get('/paginated', FollowedCTRL.getFollowedPaginated);
followedRoutes.get('/paginatedUser', FollowedCTRL.getOterUserFollowedPaginated);
followedRoutes.get('/isfollowed', FollowedCTRL.isFollowed)
followedRoutes.get('/:id', FollowedCTRL.getFollowed)
followedRoutes.post('/', FollowedCTRL.createFollowed)
followedRoutes.put('/:id', FollowedCTRL.updateFollowed)
followedRoutes.delete('/:id', FollowedCTRL.deleteFollowed)

export default followedRoutes