import { conn } from "../../index.js";


class ProductController {
    index(req, res, next) {
        const sql = "SELECT * FROM product";
        conn.query(sql, function (err, data) {
            if (err) throw err;
            res.json(data);
        });
    }

    storeProduct(req, res, next) {
        const { title, price, desc, category_id, details } = req.body;
        let thumbnails = [];
        req.files.forEach((file) => {
            thumbnails.push("public/img/products/" + file.filename);
        })
        const sql = "INSERT INTO product (category_id, title, price, description, thumbnails) VALUES(?, ?, ?, ?, ?);";
        conn.query(sql, [+category_id, title, price, desc, thumbnails.join(",")], function (err, result) {
            if (err) {
                console.error(err);
                res.json({ status: 'ERROR', message: "Lưu sản phẩm thất bại" });
                return;
            };
            req.details = JSON.parse(details).map(item => ({ product_id: result.insertId, ...item }));
            next();
        });
    }

    storeProductStock(req, res, next) {
        const values = req.details.map((item) => [item.product_id, item.color.trim(), item.size.trim(), item.quantity]);
        const sql = `INSERT INTO stock (product_id, color, size, quantity) VALUES ? ;`;

        conn.query(sql, [values], function (err, result) {
            if (err) {
                console.error(err);
                res.json({ status: 'ERROR', message: "Lưu sản phẩm vào kho thất bại" });
                return;
            };
            res.json({ status: 'SUCCESS', message: "Sản phẩm đã được lưu!" });
        });
    }

    getProductforCart(req, res, next) {
        const idproduct = req.body.idproduct;
        const sql = `SELECT title, price, thumbnails FROM product WHERE idproduct = ${idproduct};`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                req.title = rows[0].title;
                req.price = rows[0].price;
                req.thumbnail = rows[0].thumbnails.split(',')[0];
                next();
            })
            .catch((err) => next(err));
    }

    getRating(req, res, next) {
        const idproduct = req.params.id;

        const sql = `SELECT rate FROM user_reviews WHERE ordered_product_id = ${idproduct};`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                const quantity = rows.length;
                const rating = rows.reduce((pre, item) => pre + item, 0) || 0;
                return res.json({
                    rating,
                    quantity
                });
            })
            .catch((err) => console.error(err));
    }

    getColors(req, res, next) {
        const idproduct = req.params.id;

        const sql = `SELECT color FROM stock WHERE product_id = ${idproduct};`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                let colors = [];
                rows.forEach((row) => {
                    if (!colors.includes(row.color)) {
                        colors.push(row.color);
                    }
                })
                return res.json(colors);
            })
            .catch((err) => console.error(err));
    }

    getSizes(req, res, next) {
        const idproduct = req.params.id;

        const sql = `SELECT size FROM stock WHERE product_id = ${idproduct};`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                let sizes = [];
                rows.forEach((row) => {
                    if (!sizes.includes(row.size)) {
                        sizes.push(row.size);
                    }
                })
                return res.json(sizes);
            })
            .catch((err) => console.error(err));
    }
}

export default new ProductController;