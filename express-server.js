const express = require('express');
const emailModule = require('./emailModules');
const supabase = require('./supabase');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(bodyParser.json());
 
app.post('/getdata', async (req, res) => {
    res.set('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let mail = req.body.mail;
    let subject = req.body.subject;
    let message = req.body.message;
    let name = req.body.name;

    let mailOptions = {
        from: mail,
        to: process.env.mailId,
        subject: '#Portfolio ' + subject,
        text: `Hi\nthis is ${name}\n\n${message}\n\nRegards,\n${mail}`
    };

    let response = {};

    // Insert a new record into the database
    
    await supabase.client
    .from(process.env.DATABASE_NAME)
    .insert(
        {   
            name: name,
            email: mail,
            summary:subject,
            message:message,
        },)
   
    .then(() => {
        emailModule.transporter.sendMail(mailOptions)
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