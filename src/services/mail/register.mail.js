const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const registerMail = (email) => {
    const token = jwt.sign({ mail: email }, process.env.MAIL_TOKEN_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASS
        }
    });
    const mailOptions = {
        from: "Music Life",
        to: email,
        subject: 'Validate your email',
        text: `Please validate your email with the following link: localhost:3000/api/v1/user/validate?email=${email}&token=${token}`
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