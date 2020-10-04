const register = require('./register');
const signin = require('./signin');
const token = require('./token');
const signout = require('./signout');

const controller = {
    register: register,
    signin: signin,
    token: token,
    signout: signout
};

module.exports = controller;