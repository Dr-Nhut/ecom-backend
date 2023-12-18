import { conn } from "../../index.js";


class CartController {
    index(req, res, next) {
        const idCart = req.params.id;
        const sql = `SELECT idCart, quantity, totalPrice FROM cart WHERE idCart = ${idCart}`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                return res.json(rows[0]);
            })
            .catch(err => console.error(err));
    }

    changeQuantity(req, res, next) {
        const idCartDetail = req.query.idCartDetail;
        req.quantity = 0;
        req.total = req.body.totalChange;
        const sql = `UPDATE cart_detail SET quantity = ${req.body.currentQuantity} WHERE idCartDetail = ${idCartDetail}`;
        conn.promise().query(sql)
            .then(() => {
                next();
            })
            .catch(err => console.error(err));
    }

    createCart(req, res, next) {
        const idCart = req.params.id;
        const sql = `SELECT idCart FROM cart WHERE idCart = ${idCart}`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                if (rows.length === 0) {
                    const sql = `INSERT INTO cart (idCart) VALUES(${idCart}) ;`
                    conn.query(sql, () => next());
                }
                else {
                    next();
                }
            })
            .catch(err => console.error(err));
    }

    store(req, res, next) {
        const idCart = req.params.id;
        const idStock = req.idStock;
        const { idproduct, count } = req.body;
        const title = req.title;
        const price = req.price;
        const thumbnail = req.thumbnail;

        const sql = `SELECT * FROM cart_detail WHERE idStock = ${idStock} AND  idCart = ${idCart};`;
        conn.promise().query(sql)
            .then((response) => {
                if (response[0].length > 0) {
                    const row = response[0][0];
                    const sql = `UPDATE cart_detail SET quantity = ${row.quantity + count} WHERE idStock = ${idStock};`
                    conn.promise().query(sql)
                        .then(() => next())
                        .catch(err => next(err));
                }
                else {
                    const sql = `INSERT INTO cart_detail (product_id, idStock, idCart, product_name, product_thumbnail, product_price, quantity) VALUES(?,?,?,?,?,?,?);`;
                    conn.promise().query(sql, [+idproduct, idStock, +idCart, title, thumbnail, +price, +count])
                        .then(() =>  next())
                        .catch(err => next(err));
                }
            })
    }

    getCartItems(req, res, next) {
        const idCart = req.params.id;
        const sql = `SELECT idCartDetail, product_name, product_thumbnail, product_price, quantity, idStock FROM cart_detail WHERE idCart = ${idCart};`;
        conn.promise().query(sql)
            .then((rows, fields) => {
                req.result = rows[0];
                const idStocks = rows[0].map((row) => row.idStock);
                req.stock = [];
                return Promise.all(idStocks.map(async (idStock) => {
                    const sql = `SELECT idStock, color, size FROM stock WHERE idStock = ${idStock}`;
                    await conn.promise().query(sql)
                        .then((rows, fields) => {
                            req.stock = [...req.stock, rows[0][0]];
                        })
                }));
            })
            .then(() => {
                req.result.map((row) => {
                    req.stock.forEach((stock) => {
                        if (stock.idStock === row.idStock) {
                            row.color = stock.color;
                            row.size = stock.size;
                        }
                    })
                    delete row.idStock;
                })
                res.json(req.result);
            })
            .catch(err => next(err));
    }

    getDetailCart(req, res, next) {
        const idCart = req.params.id;
        const sql = `SELECT product_price, quantity  FROM cart_detail WHERE idCart = ${idCart};`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                req.quantity = rows.length;
                req.total = rows.reduce((pre, current) => {
                    const totalPrice = current.product_price * current.quantity;
                    return pre + totalPrice;
                }, 0)
                next();
            })
            .catch(err => console.error(err));
    }

    updateCart(req, res, next) {
        const idCart = req.params.id;
        const quantity = req.quantity;
        const totalPrice = req.total;
        const sql = `UPDATE cart SET quantity=${quantity}, totalPrice= ${totalPrice} WHERE idCart= ${idCart};`
        conn.promise().query(sql)
            .then((response) => {
                res.json({
                    status: 'SUCCESS',
                    quantity,
                    totalPrice,
                })
            })
            .catch(err => next(err));
    }

    getIdStock(req, res, next) {
        const { idproduct, color, size } = req.body;
        const sql = `SELECT idStock FROM stock WHERE idproduct = '${idproduct}' AND color = '${color}' AND size = '${size}';`;
        conn.promise().query(sql)
            .then(([rows]) => {
                req.idStock = rows[0].idStock;
                next();
            })
            .catch((err) => next(err));
    }

    deleteItem(req, res, next) {
        const idCartDetail = req.query.idCartDetail;
        const sql = `DELETE FROM cart_detail WHERE idCartDetail = ${idCartDetail};`;
        conn.promise().query(sql)
            .then((response) => {
                next();
            })
            .catch((err) => console.error(err));
    }
}

export default new CartController; 