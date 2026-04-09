const { body, param } = require('express-validator');
const phoneRegex = /^[+]?[\d\s\-().]+$/;

const updateUserValidation = [
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('full_name')
        .optional()
        .isLength({ max: 255 }).withMessage('Name too long'),
    body('phone')
        .optional()
        .isString().withMessage('Phone must be a string')
        .isLength({ min: 7, max: 20 }).withMessage('Phone must be between 7 and 20 characters')
        .matches(phoneRegex).withMessage('Phone contains invalid characters'),
    body('date_of_birth')
        .optional()
        .isDate().withMessage('Invalid date format'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
    body('is_active')
        .optional()
        .isBoolean().withMessage('is_active must be a boolean')
];

const assignRoleValidation = [
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role'),
    body('academy_id')
        .optional()
        .isInt().withMessage('Academy ID must be an integer')
];

const resetPasswordValidation = [
    body('new_password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const userIdParamValidation = [
    param('id')
        .isInt().withMessage('User ID must be an integer')
];

module.exports = {
    updateUserValidation,
    assignRoleValidation,
    resetPasswordValidation,
    userIdParamValidation
};