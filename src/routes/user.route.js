const express = require('express');
const router = express.Router();
const controller = require('./../controllers/user.controller');
const authenticateToken = require('./../services/authentication');

router.post('/register', controller.register);
router.get('/validate', controller.validate);
router.post('/token', controller.token);
router.post('/signout', controller.signout);
router.post('/signin', controller.signin);
router.post('/forgot', controller.forgotPassword);
router.get('/reset', controller.resetPassword);
router.post('/change-password', authenticateToken, controller.changePassword);
router.post('/signin-fb', controller.signInWithFacebook);
router.post('/me', authenticateToken, controller.getUserInfo);
router.post('/update-info', authenticateToken, controller.updateInfo);

module.exports = router;