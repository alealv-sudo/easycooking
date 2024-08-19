import express from "express"
import ListCalendarCTRL from "../controllers/ListCalendarController.js";

const router = express.Router()

router.get('/', ListCalendarCTRL.getAllItems);
router.get('/:id', ListCalendarCTRL.getItem);
router.get('/list/:id/daylist/:day', ListCalendarCTRL.getUserItems);
router.post('/', ListCalendarCTRL.createItems);
router.put('/', ListCalendarCTRL.updateItem);
router.delete('/:id', ListCalendarCTRL.deleteItem);

export default router