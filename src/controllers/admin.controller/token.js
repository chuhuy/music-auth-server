const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const token = (req, res) => {
    if(!req.body.username || !req.body.refresh_token) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }

    const existRefreshTokenSql = `SELECT EXISTS(SELECT * FROM admin WHERE admin.refresh_token = '${req.body.refresh_token}') AS exist`;
    connection.query(existRefreshTokenSql, (error, results, field) => {
        if(error || !results[0]["exist"]) {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: "Fail to get token"
            })
        } else {
            jwt.verify(req.body.refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) {
                    return res.json({
                        status: false,
                        code: 4000,
                        errorMessage: "Fail to get token"
                    })
                } else {
                    const user = { name: req.body.username };
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