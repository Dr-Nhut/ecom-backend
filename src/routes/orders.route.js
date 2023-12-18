import express from "express";
import OrderController from "../controllers/OrderController.js";
const router = express.Router();

router.get('/all', OrderController.getAll);
router.get("/quantity", OrderController.getQuantity)
router.get("/:id", OrderController.storeOrder);

router.put('/:id/status', OrderController.updateStatus);


export default router;