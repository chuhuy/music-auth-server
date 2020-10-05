const connection = require('./../../database/connect');
const emailCrypt = require('./../../helper/crypt.email');

const validate = (req, res) => {
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
};

module.exports = validate;