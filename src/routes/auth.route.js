import express from "express";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

router.get("/", AuthController.index);
router.post("/register", AuthController.checkEmail, AuthController.register);
router.post("/login", AuthController.login);
router.post("/address",AuthController.getUserId, AuthController.storeAddress);

export default router;