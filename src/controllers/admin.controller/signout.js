const { sign } = require('jsonwebtoken');
const connection = require('./../../database/connect');
const nodemailer = require('nodemailer');

const signout = (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASS
        }
    });
    const mailOptions = {
        from: 'Music Life',
        to: 'chuhuy2911@gmail.com',
        subject: 'Test mail from Music Life',
        text: 'Test content'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

    if(!req.body.username || !req.body.refresh_token) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }

    const signoutSql = `UPDATE admin SET admin.refresh_token = NULL WHERE admin.username = '${req.body.username}' AND admin.refresh_token = '${req.body.refresh_token}'`;
    connection.query(signoutSql, (error, results, fields) => {
        if(error || !results["affectedRows"]) {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: "Invalid param"
            })
        } else {
            return res.status(200).json({
                status: true,
                code: 2004,
                message: "Signed out"
            });
        }
    })
};

module.exports = signout;