import express from "express";
import productController from "../controllers/ProductController.js";
const router = express.Router();
import upload from "../middlewares/upload.js"


router.get("/", productController.index);
router.get("/getAll", productController.getAllProducts);
router.get('/quantity', productController.getQuantity);
router.get("/:id", productController.getProduct);
router.get('/:id/rating', productController.getRating);
router.get('/:id/colors', productController.getColors);
router.get('/:id/sizes', productController.getSizes);

router.post("/", upload.array('thumbnail', 10), productController.storeProduct, productController.storeProductStock);

router.put('/:id/edit', upload.array('thumbnail', 10), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);
export default router;