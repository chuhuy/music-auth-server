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
    
    const queryCondition = isUsername ? `user.username = '${req.body.username}'` 
                                      : `user.email = '${req.body.email}'`;
    const signinSql = `SELECT user.username, user.secret FROM user WHERE ${queryCondition}`;

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
                    const user = { name: results[0]["username"] };

                    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4w' });
                    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y'});

                    const insertRefreshTokenSql = `UPDATE user SET user.refresh_token = '${refresh_token}' WHERE user.username = '${user.name}'`;

                    connection.query(insertRefreshTokenSql, (err, result, field) => {
                        if(err || !result["affectedRows"]) {
                            return res.json({
                                status: false,
                                code: 4000,
                                errorMessage: 'Fail to sign in'
                            })
                        }
                        else {
                            const queryString = `SELECT u.email, u.display_name, u.username, u.image_url, u.default_avatar FROM user u
                                                 WHERE u.del_flg = 0
                                                 AND u.username = ?;`
                            connection.query(queryString, user.name, (error, results) => {
                                if(error) {
                                    console.log(error);
                                    return res.status(200).json({
                                        status: false,
                                        code: 5000,
                                        errorMessage: 'Internal Server Error'
                                    });
                                } else if(results[0]) {
                                    return res.json({
                                        status: true,
                                        code: 2000,
                                        data: {
                                            access_token: access_token,
                                            refresh_token: refresh_token,
                                            email: results[0].email,
                                            display_name: results[0].display_name,
                                            username: results[0].username,
                                            image_url: results[0].image_url,
                                            default_avatar: results[0].default_avatar,
                                        }
                                    });
                                } else {
                                    return res.json({
                                        status: false,
                                        code: 4000,
                                        errorMessage: 'Invalid token'
                                    });
                                }
                            });
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