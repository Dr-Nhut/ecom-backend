import authRouter from "./auth.route.js";
import productsRouter from "./products.route.js";
import categoriesRouter from "./categories.route.js";
import cartRouter from "./cart.route.js";

function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/categories", categoriesRouter);
    app.use("/api/cart", cartRouter);
}

export default route;