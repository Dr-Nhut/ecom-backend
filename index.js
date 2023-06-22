import express from 'express';
import mysql from 'mysql2';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import route from "./src/routes/index.js";

const PORT = process.env.PORT || 3000;
//connect database
export const conn = mysql.createConnection({
    host: "localhost",
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
});


conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected Database!!!")
});

const app = express()

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use('/public', express.static('src/public'));
app.use(morgan('combined'))

route(app);

app.listen(PORT, function () {
    console.log(`Server running http://localhost:${PORT}`);
})