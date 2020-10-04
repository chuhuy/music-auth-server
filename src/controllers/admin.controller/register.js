const bcrypt = require('bcrypt');
const connection = require('./../../database/connect');

const register = (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }

    const existsUsernameSql = `SELECT EXISTS(SELECT * FROM admin WHERE admin.username = '${req.body.username}') AS exist`;
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
                errorMessage: 'Username has already been used'
            });
        } else {
            const saltRounds = 12;
            bcrypt.hash(req.body.password, saltRounds).then((hash) => {
                const registerSql = `INSERT INTO admin (username, secret) VALUES ('${req.body.username}', '${hash}')`;
                connection.query(registerSql, (error, results, fields) => {
                    if(error) {
                        return res.status(200).json({
                            status: false,
                            code: 5001,     // Cannot create
                            errorMessage: 'Fail to register'
                        });
                    }
                    else {
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