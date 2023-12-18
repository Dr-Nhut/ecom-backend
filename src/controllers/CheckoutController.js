import { conn } from "../../index.js";

class CheckoutController {
    store(req, res, next) {
        const idUser = req.idUser;
        const products = req.body.products;
        const cart = req.body.cart;

        const sql = "INSERT INTO orders (idUser, totalPrice, quantity, orderStatus, payment) VALUES (?, ?, ?, ?, ?);";
        conn.promise().query(sql, [+idUser, cart.totalPrice, cart.quantity, 0, 0])
            .then((response) => {
                const idOrders = response[0].insertId;
                products.map((item) => {
                    const sql = "INSERT INTO orders_detail (idOrder, idCartItem) VALUES (?, ?);";
                    conn.promise().query(sql, [idOrders, item.idCartDetail])
                        .catch((error) => console.error(error));
                })
            })
            .then(() => {
                res.json({status: 'success'});
            })
            .catch(err => console.error(err));
    }
}

export default new CheckoutController;