const bcrypt = require('bcrypt');
const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const signin = (req, res) => {
    const signinSql = `SELECT admin.secret FROM admin WHERE admin.username = '${req.body.username}'`;
    connection.query(signinSql, (error, results, fields) => {
        if(error) {
            res.json({
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

                    const insertRefreshTokenSql = `UPDATE admin SET admin.refresh_token = '${refresh_token}' WHERE admin.username = '${req.body.username}'`;
                    connection.query(insertRefreshTokenSql, (err, result, field) => {
                        if(err || !result["affectedRows"]) {
                            res.json({
                                status: false,
                                code: 4000,
                                errorMessage: 'Fail to sign in'
                            })
                        }
                        else {
                            res.json({
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
                    res.json({
                        status: false,
                        code: 4000,
                        errorMessage: 'Incorrect password'
                    })
                }
            }).catch(() => {
                res.json({
                    status: false,
                    code: 4000,
                    errorMessage: 'Fail to sign in'
                })
            });
        } else {
            res.json({
                status: false,
                code: 4000,
                errorMessage: 'This account does not exist'
            })
        }
    })
}

module.exports = signin;