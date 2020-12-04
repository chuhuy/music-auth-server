const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const changePassword = (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    const queryString = `SELECT u.email, u.display_name, u.username, u.image_url, u.default_avatar FROM user u
                         WHERE u.del_flg = 0
                         AND u.username = ?;`
    connection.query(queryString, [jwt.decode(token).name], (error, results) => {
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
                data: results[0]
            });
        } else {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: 'Invalid token'
            });
        }
    });
};

module.exports = changePassword;