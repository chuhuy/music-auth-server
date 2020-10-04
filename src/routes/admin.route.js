const express = require('express');
const router = express.Router();
const controller = require('./../controllers/admin.controller');

router.post('/register', controller.register);
router.post('/signin', controller.signin);
router.post('/token', controller.token);
router.post('/signout', controller.signout);

module.exports = router;