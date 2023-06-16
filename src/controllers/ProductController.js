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
        const { title, price, desc, details } = req.body;
        let thumbnails = [];
        req.files.forEach((file) => {
            thumbnails.push("public/img/products/" + file.filename);
        })
        const sql = "INSERT INTO product (title, price, description, thumbnails) VALUES(?, ?, ?, ?);";
        conn.query(sql, [title, price, desc, thumbnails.join(",")], function (err, result) {
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
        const values = req.details.map((item) => [item.product_id, item.color, item.size, item.quantity]);
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
}

export default new ProductController;