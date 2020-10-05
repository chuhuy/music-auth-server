const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const resetPassword = (req, res) => {
    jwt.verify(req.query.t, process.env.MAIL_TOKEN_SECRET, (error, password) => {
        if(error) {
            return res.send('Your token had been expired');
        }
        else {
            const resetPasswordSql = `UPDATE user SET user.secret = '${req.query.s}' WHERE user.email = '${req.query.e}'`;
            connection.query(resetPasswordSql, (error, results, field) => {
                if(error) {
                    return res.send('Failed to reset password');
                }
                else if(!results['changedRows']){
                    return res.send("Your password had already been reset");
                }
                else {
                    return res.send('Reset password successfully');
                }
            });
        }
    })
}

module.exports = resetPassword;