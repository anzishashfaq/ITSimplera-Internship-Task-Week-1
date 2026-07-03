const express = require('express');
const { body } = require('express-validator');
const { updateProfile, changePassword } = require('../controllers/userController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put(
  '/profile',
  [body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')],
  validate,
  updateProfile
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;
