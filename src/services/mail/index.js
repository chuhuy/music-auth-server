const registerMail = require('./register.mail');
const resetPasswordMail = require('./reset-password.mail');

const mail = {
    registerMail: registerMail,
    resetPasswordMail: resetPasswordMail
};

module.exports = mail;