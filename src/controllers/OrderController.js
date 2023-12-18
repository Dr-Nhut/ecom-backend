import { conn } from "../../index.js";

class OrderController {
    storeOrder(req, res, next) {

    }

    getQuantity(req, res, next) {
        const sql = "SELECT * FROM orders";
        conn.promise().query(sql)
            .then((response) => {
                res.json({ quantity: response[0].length });
            })
            .catch((err) => console.error(err));
    }

    getAll(req, res, next) {
        const sql = "SELECT idOrders, orders.idUser, email, totalPrice, orderStatus, payment, address, quantity FROM orders JOIN user ON orders.idUser = user.idUser;"
        conn.promise().query(sql)
            .then((response) => {
                const orders = response[0].map((order) => ({
                    id: order.idOrders,
                    idUser: order.idUser,
                    emailUser: order.email,
                    totalPrice: order.totalPrice,
                    status: order.orderStatus,
                    payment: order.payment,
                    address: order.address,
                    quantity: order.quantity
                }));
                res.json(orders);
            })
            .catch((err) => console.error(err));
    }

    updateStatus(req, res, next) {
        const idOrders = req.params.id;
        const sql = `UPDATE orders SET orderStatus = ${req.body.status} WHERE idOrders = ${idOrders}`;
        conn.promise().query(sql)
            .then(() => res.json({ status: 'success' }))
            .catch((err) => console.error(err));
    };
}

export default new OrderController; 