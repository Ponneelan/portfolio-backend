const express = require('express');
const url = require('url');
const modules = require('./modules');
const cors = require('cors');
require('dotenv').config()


const app = express();
app.use(cors({
    origin: '*'
  }));

app.get('/sentmail', (req, res) => {
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

    let response ={};
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

});




app.listen(3000, () => {
    console.log('Server started on port http://localhost:3000');
});