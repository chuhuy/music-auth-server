const bcrypt = require('bcrypt');
const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const signin = (req, res) => {
    if(!req.body.password) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }
    let isUsername = true;
    if(req.body.email){
        if(validator.isEmail(req.body.email)) isUsername = false;
        else {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: "Invalid email"
            })
        }
    } else if(req.body.username) {
        isUsername = true;
    } else {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }
    
    const signinSql = isUsername ? `SELECT user.secret FROM user WHERE user.username = '${req.body.username}'`
                                 : `SELECT user.secret FROM user WHERE user.email = '${req.body.email}'`;
    connection.query(signinSql, (error, results, fields) => {
        if(error) {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: 'Fail to sign in'
            })
        }
        else if(results.length) {
            bcrypt.compare(req.body.password, results[0]["secret"]).then((result) => {
                if(result) {
                    const user = { name: req.body.username };

                    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
                    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2w'});

                    const insertRefreshTokenSql = isUsername ? `UPDATE user SET user.refresh_token = '${refresh_token}' WHERE user.username = '${req.body.username}'`
                                                             : `UPDATE user SET user.refresh_token = '${refresh_token}' WHERE user.email = '${req.body.email}'`;
                    connection.query(insertRefreshTokenSql, (err, result, field) => {
                        if(err || !result["affectedRows"]) {
                            return res.json({
                                status: false,
                                code: 4000,
                                errorMessage: 'Fail to sign in'
                            })
                        }
                        else {
                            return res.json({
                                status: true,
                                code: 2000,
                                message: 'Sign in successfully',
                                data: {
                                    access_token: access_token,
                                    refresh_token: refresh_token
                                }
                            })
                        }
                    })  
                } else {
                    return res.json({
                        status: false,
                        code: 4000,
                        errorMessage: 'Incorrect password'
                    })
                }
            }).catch(() => {
                return res.json({
                    status: false,
                    code: 4000,
                    errorMessage: 'Fail to sign in'
                })
            });
        } else {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: 'This account does not exist'
            })
        }
    })
}

module.exports = signin;