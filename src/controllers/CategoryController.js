import { conn } from "../../index.js";


class CategoryController {
    index(req, res, next) {
        const sql = "SELECT * FROM category";
        conn.query(sql, function (err, data) {
            if (err) throw err;
            res.json(data);
        });
    }

    storeCategory(req, res, next) {
        const { name, desc } = req.body;
        const thumbnail = "public/img/categories/" + req.file.filename;
        const sql = "INSERT INTO category (thumbnail, name, description ) VALUES(?, ?, ?)";
        conn.query(sql, [thumbnail, name, desc], function (err, result) {
            if (err) {
                console.error(err);
                res.json({ status: 'ERROR', message: "Tạo danh mục thất bại" });
                return;
            };
            res.json({ status: 'SUCCESS', message: "Danh mục đã được tạo!" });
        });
    }

    getCategory(req, res, next) {
        const id = req.params.id;
        const sql = "SELECT name, thumbnail, description FROM category WHERE idcategory =" + id + ";";
        conn.query(sql, function (err, data) {
            if (err) throw err;
            res.json({
                'name': data[0].name,
                'urlThumbnail': process.env.URL + data[0].thumbnail,
                description: data[0].description,
            });
        })
    }

    editCategory(req, res, next) {
        const id = req.params.id;
        const { name , desc } = req.body;
        const thumbnail = req.file ? `thumbnail = "public/img/categories/${req.file.filename}",` : "";
        const sql = `UPDATE category SET name = '${name}', ${thumbnail} description = '${desc}' WHERE idcategory = ${id};`;
        conn.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                res.json({ status: 'ERROR', message: "Chỉnh sửa danh mục thất bại" });
                return;
            };
            res.json({ status: 'SUCCESS', message: "Danh mục đã được chỉnh sửa!" });
        });
    }

    deleteCategory(req, res, next) {
        const id = req.params.id;
        const sql = `DELETE FROM category WHERE idcategory = ${id};`;
        conn.query(sql, function (err) {
            if (err) {
                console.error(err);
                res.json({ status: 'ERROR', message: "Đã xảy ra lỗi" });
                return;
            };
            res.json({ status: 'SUCCESS', message: "Danh mục đã được xóa!" });
        });
    }
}

export default new CategoryController;