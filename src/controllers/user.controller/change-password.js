const bcrypt = require('bcrypt');
const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const changePassword = (req, res) => {
    if(!req.body.old_password || !req.body.new_password) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        });
    } else if(req.body.old_password === req.body.new_password) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Old and new password cannot be the same"
        })
    }
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const username = jwt.decode(token).name;

    const queryString1 = `SELECT user.secret FROM user
                          WHERE user.username = ?;`
    connection.query(queryString1, [username], (error, results) => {
        if(error) {
            return res.json({
                status: false,
                code: 5000,
                errorMessage: 'Internal Server Error'
            });
        } else if(results) {
            bcrypt.compare(req.body.old_password, results[0].secret).then((result) => {
                if(result){
                    const queryString2 = `UPDATE user
                                          SET user.secret = ?
                                          WHERE user.username = ?;`;
                    const saltRounds = 12;
                    bcrypt.hash(req.body.new_password, saltRounds).then((hash) => {
                        connection.query(queryString2, [hash, username],(error, result) => {
                            if(error) {
                                return res.json({
                                        status: false,
                                        code: 5000,
                                        errorMessage: 'Internal Server Error'
                                })
                            } else {
                                return res.json({
                                    status: true,
                                    code: 2000,
                                    message: 'Changed password successfully'
                                })
                            }
                        })
                    })
                } else {
                    return res.json({
                        status: false,
                        code: 4000,
                        errorMessage: 'Incorrect password'
                    })
                }
                
            })
        }
    })
};

module.exports = changePassword;