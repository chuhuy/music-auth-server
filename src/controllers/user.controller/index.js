const register = require('./register');
const validate = require('./validate');
const token = require('./token');
const signout = require('./signout');
const signin = require('./signin');
const forgotPassword = require('./forgot-password');
const resetPassword = require('./reset-password');
const changePassword = require('./change-password');

const controller = {
    register: register,
    validate: validate,
    token: token,
    signout: signout,
    signin: signin,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    changePassword: changePassword
};

module.exports = controller;