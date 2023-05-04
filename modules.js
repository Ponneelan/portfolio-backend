// create a transporter object
const nodemailer = require("nodemailer");
require('dotenv').config();

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




module.exports = {
    transporter,
};