import express from "express"
import LikeCTRL from "../controllers/LikeController.js";

const router = express.Router()

router.get('/', LikeCTRL.getAllLikes);
router.get('/:id', LikeCTRL.getLike);
router.get('/alluser/:id', LikeCTRL.getUserLikes);
router.post('/', LikeCTRL.createLike);
router.put('/', LikeCTRL.updateLike);
router.delete('/:id', LikeCTRL.deleteLike);
router.post('/like', LikeCTRL.handleLikeClicked);

export default router