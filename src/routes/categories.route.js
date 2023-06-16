import express from "express";
import categoryController from "../controllers/CategoryController.js";
const router = express.Router();
import { uploadCategory } from "../middlewares/upload.js"

router.get("/", categoryController.index);
router.post("/", uploadCategory.single('thumbnail'), categoryController.storeCategory);
router.get("/:id", categoryController.getCategory);
router.put("/:id/edit",uploadCategory.single('thumbnail'), categoryController.editCategory);

export default router;