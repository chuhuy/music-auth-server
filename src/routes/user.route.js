const express = require('express');
const router = express.Router();
const controller = require('./../controllers/user.controller');

router.post('/register', controller.register);
router.get('/validate', controller.validate);
router.post('/token', controller.token);
router.post('/signout', controller.signout);
router.post('/signin', controller.signin);

module.exports = router;