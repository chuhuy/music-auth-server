const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const signInWithFacebook = (req, res) => {
    if(!req.body.access_token) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        });
    }

    
    fetch(`https://graph.facebook.com/me?access_token=${req.body.access_token}`)
    .then(res => res.json())
    .then(json => {
        const userId = json.id;
        const displayName = json.name;
        console.log(json)
        if(!userId || !displayName) {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: "Failed to login with facebook"
            });
        }

        const existUserId = `SELECT EXISTS(SELECT * FROM user WHERE user.username = '${userId}') AS exist`;
        connection.query(existUserId, (error, results, fields) => {
            console.log(results);
            if(error) {
                return res.status(200).json({
                    status: false,
                    code: 5000,     // Server Error
                    errorMessage: 'Internal Server Error'
                });
            }
            if(results[0]["exist"]) {
                // Login
                const user = { name: userId };

                const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4w' });
                const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y'});

                const insertRefreshTokenSql = `UPDATE user SET user.refresh_token = '${refresh_token}' WHERE user.username = '${userId}'`;
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
                        // return res.json({
                        //     status: true,
                        //     code: 2000,
                        //     message: 'Sign in successfully',
                        //     data: {
                        //         access_token: access_token,
                        //         refresh_token: refresh_token
                        //     }
                        // })
                    }
                })  
            } else {
                // Register
                const registerSql = `INSERT INTO user (username, display_name, validation, default_avatar) VALUES ('${userId}', '${displayName}', 1, FLOOR(RAND()*9 + 1))`;
                connection.query(registerSql, (error, results, fields) => {
                    if(error) {
                        return res.status(200).json({
                            status: false,
                            code: 5001,     // Cannot create
                            errorMessage: 'Fail to register'
                        });
                    }
                    else {
                        // Login
                        const user = { name: userId };

                        const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4w' });
                        const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y'});

                        const insertRefreshTokenSql = `UPDATE user SET user.refresh_token = '${refresh_token}' WHERE user.username = '${userId}'`;
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
                    }
                });
            }
        })
    })
    .catch(error => {
        return res.json({
            status: false,
            code: 5000,
            errorMessage: 'Internal Server Error'
        })
    })
}

module.exports = signInWithFacebook;