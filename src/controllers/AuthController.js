import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conn } from "../../index.js";

class AuthController {
    index(req, res, next) {
        jwt.verify(req.cookies.ecommerceToken, 'ecommerce', function(err, decoded) {
            if(err) throw err;
            if(decoded) {
                const sql = `SELECT firstName, lastName FROM user WHERE idUser = ${decoded.userId};`;
                conn.promise().query(sql)
                    .then(([rows, fields]) => {  
                        console.log(rows)
                        if(rows.length > 0) {
                            res.json({
                                user: `${rows[0].firstName} ${rows[0].lastName}`,
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
                        res.json({
                            status: 'SUCCESS',
                            idUser: result.insertId
                        })
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
                                "ecommerce",
                                { expiresIn: "24h" }
                            );
                            res.json({
                                lastName: rows[0].lastName,
                                token,
                                admin: rows[0].role_id === 1
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
}

export default new AuthController;