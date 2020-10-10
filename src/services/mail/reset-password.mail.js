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
            text: `Your new password is: ${password}. Please click the following link to reset your password: http://${process.env.SERVER_HOST}/api/v1/user/reset?s=${hash}&e=${email}&t=${token}`,
            html: `<div style="width: 600px; margin: auto; padding: 10px 20px 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"><h1 style="margin: 0; font-size: 30px">Hi,</h1><p style="margin: 24px 0 30px">You recently requested to reset your password for your Life Music account. Your new password is: <strong>${password}</strong>, please click the button below to reset it.</p><div style="text-align: center; padding: 16px 25px;"><a href="http://${process.env.SERVER_HOST}/api/v1/user/reset?s=${hash}&e=${email}&t=${token}" style=" background-color: #000A19; color: #fff; margin: 30px 0; padding: 16px 25px; font-size: 16px; cursor: pointer; text-decoration: none; border-radius: 4px;">Reset your password</a></div><p style="margin: 30px 0 0">If you didn't request a password reset, please ignore this email. The password reset is only valid for the next 20 minutes.</p><p style="margin: 24px 0 0">Thanks,</p><p style="margin: 6px 0 0; font-size: 13px">The Life Music Team</p></div>`
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