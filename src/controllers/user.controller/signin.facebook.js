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

                const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
                const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2w'});

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
                // Register
                const registerSql = `INSERT INTO user (username, display_name, validation) VALUES ('${userId}', '${displayName}', 1)`;
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

                        const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
                        const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2w'});

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
                    }
                });
            }
        })
    })
}

module.exports = signInWithFacebook;