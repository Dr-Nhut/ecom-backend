import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conn } from "../../index.js";

class AuthController {
    index(req, res, next) {
        if (!req.cookies.ecommerceToken) return res.send(false);
        jwt.verify(req.cookies.ecommerceToken, process.env.JWT_KEY, function (err, decoded) {
            if (err) throw err;
            if (decoded) {
                const sql = `SELECT firstName, lastName, phone, role_id, address, idCart FROM user WHERE idUser = ${decoded.userId};`;
                conn.promise().query(sql)
                    .then(([rows, fields]) => {
                        if (rows.length > 0) {
                            res.json({
                                idUser: rows[0].idUser,
                                fullName: rows[0].firstName + ' ' + rows[0].lastName,
                                phone: rows[0].phone,
                                role: rows[0].role_id === 1,
                                address: rows[0].address,
                                cart: rows[0].idCart
                            })
                        }
                        else {
                            res.json({
                                user: false
                            })
                        }
                    })
                    .catch(err => console.log(err));
            }
            else {
                res.json({
                    user: false,
                })
            }
        })
    }
lo
    getUserId(req, res, next) {
        if (!req.cookies.ecommerceToken) {
            return res.send(false);
        }
        else {
            jwt.verify(req.cookies.ecommerceToken, process.env.JWT_KEY, function (err, decoded) {
                if (err) throw err;
                if (decoded) {
                    req.idUser = decoded.userId;
                    next();
                }
                else return res.send(false);;
            })
        }
    }

    checkEmail(req, res, next) {
        const email = req.body.user.email;
        const sql = `SELECT idUser FROM user WHERE email IN ('${email.trim()}');`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                if (rows.length > 0) {
                    return res.json({
                        status: 'ERROR',
                        message: 'Email đã tồn tại!'
                    })
                }
                next();
            })
            .catch((e) => console.error(e));
    }

    register(req, res, next) {
        const { firstName, lastName, email, phone, password } = req.body.user;
        bcrypt.hash(password, 10)
            .then(hash => {
                const sql = "INSERT INTO user (firstName, lastName, email, phone, passwd ) VALUES(?, ?, ?, ?, ?)";
                conn.promise().query(sql, [firstName.trim(), lastName.trim(), email, phone, hash])
                    .then(result => {
                        const sql = `UPDATE user SET idCart = ${result[0].insertId} WHERE idUser = ${result[0].insertId}`;
                        conn.promise().query(sql)
                            .then(response =>
                                res.json({
                                    status: 'SUCCESS',
                                    idUser: result[0].insertId
                                }))
                    })
                    .catch(err => console.error(err));
            })
            .catch((e) => console.error(e));

    }

    login(req, res, next) {
        const { email, password } = req.body;
        const sql = `SELECT * FROM user WHERE email IN ('${email.trim()}');`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                if (rows[0]) {
                    bcrypt.compare(password, rows[0].passwd)
                        .then((passwordCheck) => {
                            if (!passwordCheck) {
                                return res.json({
                                    status: "ERROR",
                                    message: "Tài khoản hoặc mật khẩu không đúng",
                                });
                            }
                            const token = jwt.sign(
                                {
                                    userId: rows[0].idUser
                                },
                                process.env.JWT_KEY,
                                { expiresIn: "365d" }
                            );
                            const user = {
                                idUser: rows[0].idUser,
                                fullName: rows[0].firstName + ' ' + rows[0].lastName,
                                phone: rows[0].phone,
                                role: rows[0].role_id === 1,
                                address: rows[0].address,
                                cart: rows[0].idCart
                            }
                            res.json({
                                user,
                                token,
                            });
                        })
                        .catch((err) => console.error(err));
                }
                else {
                    return res.status(400).json({
                        status: "ERROR",
                        message: "Tài khoản hoặc mật khẩu không đúng",
                    });
                }
            })
            .catch((e) => console.error(e));
    }

    storeAddress(req, res, next) {
        const idUser = req.idUser;
        const address = req.body.address;

        const sql = `UPDATE user SET address = '${address}' WHERE idUser = ${idUser}`;
        conn.promise().query(sql)
            .then((response) => {
                res.status(200).json({ status: 'SUCCESS' });
            })
            .catch((err) => console.error(err));
    }
}

export default new AuthController;