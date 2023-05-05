const express = require('express');
const url = require('url');
const modules = require('./modules');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config()


const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

app.get('/sentmail', async (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    var q = url.parse(req.url, true);

    let queryData = q.query;
    let mail = queryData.mail;
    let subject = queryData.subject;
    let message = queryData.message;
    let name = queryData.name;

    let mailOptions = {
        from: mail,
        to: process.env.mailId,
        subject: '#Portfolio ' + subject,
        text: `Hi\nthis is ${name}\n\n${message}\n\nRegards,\n${mail}`
    };

    let response = {};

    // Insert a new record into the database
    const result = await connection.query(
        'INSERT INTO PortfolioMessage (name, email, summary, message, updated_by, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [name, mail, subject, message, mail, mail]
    ).then(() => {
        modules.transporter.sendMail(mailOptions)
            .then(function (info) {
                console.log('Email sent: ' + info.response);
                response['code'] = 200;
                response['message'] = 'Mail Sent';
            })
            .catch(function (error) {
                console.log('Error occurred: ' + error.message);
                response['code'] = 404;
                response['message'] = 'Mail Not Sent';
            }).then(function () {
                console.log(response);
                res.end(JSON.stringify(response));
            });
    })
    .catch ((error) => {
        console.error(error);
        response['code'] = 500;
        response['message'] = 'Error';
        res.end(JSON.stringify(response));
    })
});




app.listen(3000, () => {
    console.log('Server started on port http://localhost:3000');
});