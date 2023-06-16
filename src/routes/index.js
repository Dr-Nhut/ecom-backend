import productsRouter from "./products.route.js";
import categoriesRouter from "./categories.route.js";

function route(app) {
    app.use("/api/products", productsRouter);
    app.use("/api/categories", categoriesRouter);
}

export default route;