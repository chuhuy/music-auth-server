const crypto = require('crypto');

const encryptEmail = (email) => {
    return crypto.createCipheriv('aes-128-cbc', email);
};

const decryptEmail = (encryptedEmail) => {
    return crypto.createDecipheriv('aes-128-cbc', encryptedEmail);
};

module.exports = {
    encryptEmail: encryptEmail,
    decryptEmail: decryptEmail
};