const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const token = (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    const existRefreshTokenSql = `SELECT EXISTS(SELECT * FROM user WHERE user.refresh_token = '${token}') AS exist`;
    connection.query(existRefreshTokenSql, (error, results, field) => {
        if(error || !results[0]["exist"]) {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: "Fail to get token"
            })
        } else {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) {
                    return res.json({
                        status: false,
                        code: 4000,
                        errorMessage: "Fail to get token"
                    })
                } else {
                    const user = { name: jwt.decode(token).name };
                    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4w' });

                    return res.json({
                        status: true,
                        code: 2000,
                        message: "Get token successfully",
                        data: {
                            access_token: access_token
                        }
                    })
                }
            })
        }
    })
}

module.exports = token;