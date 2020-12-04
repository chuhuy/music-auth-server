const connection = require('./../../database/connect');
const jwt = require('jsonwebtoken');

const updateInfo = (req, res) => {
    if(!req.body.display_name) {
        return res.json({
            status: false,
            code: 4000,
            errorMessage: "Invalid param"
        });
    }
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const username = jwt.decode(token).name;

    const queryString = `UPDATE user u
                         SET u.display_name = ?
                         WHERE u.username = ?;`;
    connection.query(queryString, [req.body.display_name, username], (error, results) => {
        if(error) {
            console.log(error);
            return res.json({
                status: false,
                code: 5000,
                errorMessage: 'Internal Server Error'
            }); 
        } else if(results) {
            return res.json({
                status: true,
                code: 2000,
                message: 'Update info successfully'
            })
        }
    })
};

module.exports = updateInfo;
