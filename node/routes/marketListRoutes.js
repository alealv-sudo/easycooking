import express from "express"
import MarketListCTRL from "../controllers/MarketListController.js";
const router = express.Router()

router.get('/', MarketListCTRL.getAllList);
router.get('/:id', MarketListCTRL.getList);
router.get('/lists/:id', MarketListCTRL.getListsUser)
router.post('/', MarketListCTRL.createList);
router.put('/', MarketListCTRL.updateList);
router.delete('/:id', MarketListCTRL.deleteList);

export default router