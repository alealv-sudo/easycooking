import express from "express"
import listItemCTRL from "../controllers/ListItemController.js";

const router = express.Router()

router.get('/', listItemCTRL.getAllItems);
router.get('/:id', listItemCTRL.getItems);
router.post('/', listItemCTRL.createItems);
router.put('/', listItemCTRL.updateItem);
router.delete('/:id', listItemCTRL.deleteItem);

export default router