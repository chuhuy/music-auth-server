const connection = require('./../../database/connect');
const bcrypt = require('bcrypt');
const register = require('./register');

const controller = {
    register: register
};

module.exports = controller;