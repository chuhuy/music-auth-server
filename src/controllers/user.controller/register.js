const bcrypt = require('bcrypt');
const connection = require('./../../database/connect');
const mail = require('./../../services/mail');

const register = (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.email || !req.body.display_name) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }

    const existsUsernameSql = `SELECT EXISTS(SELECT * FROM user WHERE user.username = '${req.body.username}' OR user.email = '${req.body.email}') AS exist`;
    connection.query(existsUsernameSql, (error, results, fields) => {
        if(error) {
            return res.status(200).json({
                status: false,
                code: 5000,     // Server Error
                errorMessage: 'Internal Server Error'
            });
        }
        if(results[0]["exist"]) {
            return res.status(200).json({
                status: false,
                code: 4001,     // Bad req from user
                errorMessage: 'Username or email has already been used'
            });
        } else {
            const saltRounds = 12;
            bcrypt.hash(req.body.password, saltRounds).then((hash) => {
                const registerSql = `INSERT INTO user (username, secret, email, display_name, default_avatar) VALUES ('${req.body.username}', '${hash}', '${req.body.email}', '${req.body.display_name}', FLOOR(RAND()*9 + 1))`;
                connection.query(registerSql, (error, results, fields) => {
                    if(error) {
                        return res.status(200).json({
                            status: false,
                            code: 5001,     // Cannot create
                            errorMessage: 'Fail to register'
                        });
                    }
                    else {
                        mail.registerMail(req.body.email);
                        return res.status(200).json({
                            status: true,
                            code: 2001,     // Created
                            data: {
                                message: 'Register successfully'
                            }
                        })
                    }
                });
            })
        }
    })
};

module.exports = register;