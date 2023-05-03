var http = require('http');
var url = require('url');
const nodemailer = require("nodemailer");
require('dotenv').config()



http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json' });

    var q = url.parse(req.url, true);
    let queryData = q.query;

    let mail = queryData.mail;
    let subject = queryData.subject;
    let message = queryData.message;
    let name = queryData.name;

    // create a transporter object
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        auth: {
            user: process.env.mailId,
            pass: process.env.password
        },
    });

    // setup email data
    let mailOptions = {
        from: mail,
        to: process.env.mailId,
        subject: '#Portfolio ' + subject,
        text: `Hi\nthis is ${name}\n\n${message}\n\nRegards,\n${mail}`
    };

    // send mail with defined transport object
    let response = {}

    transporter.sendMail(mailOptions)
        .then(function (info) {
            console.log('Email sent: ' + info.response);
            response['code'] = 200;
            response['message'] = 'Mail Sent';
        })
        .catch(function (error) {
            console.log('Error occurred: ' + error.message);
            response['code'] = 404;
            response['message'] = 'server Error';
        }).then(function (){
            console.log(response);
            res.end(JSON.stringify(response));
        });

}).listen(8000, () => {
    console.log("server Running on http://localhost:8000");
});