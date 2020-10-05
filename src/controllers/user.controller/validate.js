const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const validate = (req, res) => {
    jwt.verify(req.query.token, process.env.MAIL_TOKEN_SECRET, (error, mail) => {
        if(error) {
            return res.send('Your token had been expired');
        }
        else {
            const validateMailSql = `UPDATE user SET user.validation = 1 WHERE user.email = '${req.query.email}'`;
            connection.query(validateMailSql, (error, results, field) => {
                if(error) {
                    return res.send('Failed to validate email');
                }
                else if(!results['changedRows']){
                    return res.send("Your email had already been validated");
                }
                else {
                    return res.send('Validate email successfully');
                }
            });
        }
    })
};

module.exports = validate;