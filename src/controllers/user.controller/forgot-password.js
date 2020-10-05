const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mail = require('./../../services/mail');

const forgotPassword = (req, res) => {
    if(!req.body.email) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid email address"
        })
    }

    const randomPassword = crypto.randomBytes(4).toString('hex');
    
    mail.resetPasswordMail(req.body.email, randomPassword);

    return res.json({
        status: true,
        code: 2000,
        data: {
            message: 'Sent reset password email'
        }
    });
};

module.exports = forgotPassword;