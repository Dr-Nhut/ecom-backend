import express from "express";
import CartController from "../controllers/CartController.js";
import ProductController from "../controllers/ProductController.js";
const router = express.Router();

router.get("/:id", CartController.index);
router.post("/:id",CartController.createCart, CartController.getIdStock, ProductController.getProductforCart, CartController.store, CartController.getDetailCart, CartController.updateCart);
router.delete("/:id/item", CartController.deleteItem, CartController.getDetailCart, CartController.updateCart);
router.post("/:id/update", CartController.changeQuantity, CartController.getDetailCart, CartController.updateCart);
router.get("/:id/products", CartController.getCartItems);


export default router;