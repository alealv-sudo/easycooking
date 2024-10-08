import express from "express"
import UserCTRL  from "../controllers/UserController.js"

const router = express.Router()

router.get('/', UserCTRL.getAllUsers);
router.get('/:id', UserCTRL.getUser);
router.post('/', UserCTRL.createUser);
router.post('/email/', UserCTRL.getUserByEmailC);
router.put('/', UserCTRL.updateUser);
router.delete('/:id', UserCTRL.deleteUser);
router.get('/username/:value', UserCTRL.compareUserNames);
router.get('/email/:value', UserCTRL.compareEmail);

export default router