const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
  '/signup',
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  authController.signup
);

router.get('/verify-email', authController.verifyEmail);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

module.exports = router;
