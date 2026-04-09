const { body } = require('express-validator');
const phoneRegex = /^[+]?[\d\s\-().]+$/;

const registerValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name')
        .notEmpty().withMessage('Full name is required')
        .isLength({ max: 255 }).withMessage('Name too long'),
    body('phone')
        .optional()
        .isString().withMessage('Phone must be a string')
        .isLength({ min: 7, max: 20 }).withMessage('Phone must be between 7 and 20 characters')
        .matches(phoneRegex).withMessage('Phone contains invalid characters'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role'),
    body('academy_id')
        .optional()
        .isInt().withMessage('Academy ID must be an integer')
];

const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
    body('current_password')
        .notEmpty().withMessage('Current password is required'),
    body('new_password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

module.exports = {
    registerValidation,
    loginValidation,
    changePasswordValidation
};