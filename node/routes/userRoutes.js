import express from "express"
import UserCTRL  from "../controllers/UserController.js"

const router = express.Router()

router.get('/', UserCTRL.getAllUsers);
router.get('/:id', UserCTRL.getUser);
router.get('/email/:email', UserCTRL.getUserByEmail)
router.post('/', UserCTRL.createUser);
router.put('/:id', UserCTRL.updateUser);
router.delete('/:id', UserCTRL.deleteUser);

export default router