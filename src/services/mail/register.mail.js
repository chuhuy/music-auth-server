const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const registerMail = (email) => {
    const token = jwt.sign({ mail: email }, process.env.MAIL_TOKEN_SECRET, { expiresIn: '1h' });

    const readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
            }
            else {
                callback(null, html);
            }
        });
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASS
        }
    });
    const mailOptions = {
        from: "Music Life <noreply.musiclife@gmail.com>",
        to: email,
        subject: 'Validate your email',
        text: `Please validate your email with the following link: http://${process.env.SERVER_HOST}/api/v1/user/validate?email=${email}&token=${token}`,
        html: `<div style="width: 640px; text-align: center; margin: auto; padding: 10px 20px 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h1 style="margin: 0; font-size: 30px;">Welcome to Life Music App</h1><p style="margin: 24px 0 30px; text-align: left;">Thank you for creating an account in my app. To complete the registration process, please click this button below to verify your e-mail address.</p><a href="http://${process.env.SERVER_HOST}/api/v1/user/validate?email=${email}&token=${token}"><button style=" background-color: #000A19; color: #fff; border: none; padding: 16px 25px;   font-size: 16px; cursor: pointer; border-radius: 4px;">Verify your e-mail</button></a><p style="margin: 30px 0 0; text-align: left;">Welcome to Life Music Community!</p><p style=" margin: 6px 0 0; text-align: left; font-size: 13px;">The Life Music Team</p></div>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
};

module.exports = registerMail;