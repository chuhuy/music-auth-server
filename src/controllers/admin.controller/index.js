const register = require('./register');
const signin = require('./signin');
const token = require('./token');

const controller = {
    register: register,
    signin: signin,
    token: token
};

module.exports = controller;