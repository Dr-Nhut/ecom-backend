import express from "express";
import categoryController from "../controllers/CategoryController.js";
const router = express.Router();
import { uploadCategory } from "../middlewares/upload.js"
import AuthController from "../controllers/AuthController.js";

router.get("/", categoryController.index);
router.post("/", uploadCategory.single('thumbnail'), categoryController.storeCategory);
router.get("/:id", categoryController.getCategory);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id/edit", uploadCategory.single('thumbnail'), categoryController.editCategory);

export default router;