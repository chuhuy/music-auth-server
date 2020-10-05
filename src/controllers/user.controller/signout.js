const connection = require('./../../database/connect');

const signout = (req, res) => {
    if(!req.body.username || !req.body.refresh_token) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        })
    }

    const signoutSql = `UPDATE user SET user.refresh_token = NULL WHERE user.username = '${req.body.username}' AND user.refresh_token = '${req.body.refresh_token}'`;
    connection.query(signoutSql, (error, results, fields) => {
        if(error || !results["affectedRows"]) {
            return res.json({
                status: false,
                code: 4000,
                errorMessage: "Invalid param"
            })
        } else {
            return res.status(200).json({
                status: true,
                code: 2004,
                message: "Signed out"
            });
        }
    })
};

module.exports = signout;