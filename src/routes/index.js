import authRouter from "./auth.route.js";
import productsRouter from "./products.route.js";
import categoriesRouter from "./categories.route.js";
import cartRouter from "./cart.route.js";
import ordersRouter from "./orders.route.js";
import stripeRouter from "./stripe.route.js";
import checkoutRouter from "./checkout.route.js";

function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/categories", categoriesRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/orders", ordersRouter);
    app.use("/api/stripe", stripeRouter);
    app.use("/api/checkout", checkoutRouter);
}

export default route;