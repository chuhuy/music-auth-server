const register = require('./register');
const validate = require('./validate');
const token = require('./token');
const signout = require('./signout');
const signin = require('./signin');

const controller = {
    register: register,
    validate: validate,
    token: token,
    signout: signout,
    signin: signin
};

module.exports = controller;