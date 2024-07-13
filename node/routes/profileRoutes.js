import express from "express"
import profileCTRL  from "../controllers/ProfileController.js"

const router = express.Router()

router.get('/', profileCTRL.getAllProfiles);
router.get('/:id', profileCTRL.getProfile);
router.post('/', profileCTRL.createProfile);
router.put('/', profileCTRL.updateProfile);
router.delete('/:id', profileCTRL.deleteProfile);

//router.post('/email/', UserCTRL.getUserByEmailC);
export default router