import authRouter from "./auth.route.js";
import productsRouter from "./products.route.js";
import categoriesRouter from "./categories.route.js";

function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/categories", categoriesRouter);
}

export default route;