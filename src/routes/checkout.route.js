import express from "express";
import CheckoutController from "../controllers/CheckoutController.js";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

router.post("/", AuthController.getUserId, CheckoutController.store);

export default router;