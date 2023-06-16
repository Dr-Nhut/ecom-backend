import express from "express";
import productController from "../controllers/ProductController.js";
const router = express.Router();
import upload from "../middlewares/upload.js"


router.get("/", productController.index);
router.post("/", upload.array('thumbnail', 10), productController.storeProduct, productController.storeProductStock);

export default router;