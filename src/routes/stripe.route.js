import express from "express";
import StripeController from "../controllers/StripeController.js";
import 'dotenv/config';
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

// This is your Stripe CLI webhook secret for testing your endpoint locally.

router.post('/create-checkout-session', AuthController.getUserId, StripeController.index);

//Stripe Webhook
export default router;