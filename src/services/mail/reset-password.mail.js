const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const resetPasswordMail = (email, password) => {
    const saltRounds = 12;
    bcrypt.hash(password, saltRounds)
    .then((hash) => {
        const token = jwt.sign({ password: password }, process.env.MAIL_TOKEN_SECRET, { expiresIn: '20m' });

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
            subject: 'Reset password',
            text: `Your new password is: ${password}. Please click the following link to reset your password: ${process.env.SERVER_HOST}/api/v1/user/reset?s=${hash}&e=${email}&t=${token}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
    })
    .catch((error) => {
        console.log(error);
    })
};

module.exports = resetPasswordMail;