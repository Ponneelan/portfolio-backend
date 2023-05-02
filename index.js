var http = require('http');
var url = require('url');
const nodemailer = require("nodemailer");
require('dotenv').config()



http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var q = url.parse(req.url, true);
    let queryData = q.query;

    let mail = queryData.mail;
    let subject = queryData.subject;
    let message = queryData.message;
    let name = queryData.name;

     // create a transporter object
     let transporter = nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure:false,
        auth: {
            user: process.env.mailId,
            pass: process.env.password
        },
    });

    // setup email data
    let mailOptions = {
        from: mail,
        to: process.env.mailId,
        subject: '#Portfolio '+subject,
        text: `Hi\n this is ${name}\n\n ${message}\n\nRegards,\n${mail}`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error :'+error);
           
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.end();
  }).listen(8000);