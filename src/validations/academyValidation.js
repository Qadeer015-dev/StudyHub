const { body } = require('express-validator');

const phoneRegex = /^[+]?[\d\s\-().]+$/;  // Allows digits, spaces, hyphens, parentheses, dots, and leading +

const createAcademyValidation = [
    body('name')
        .notEmpty().withMessage('Academy name is required')
        .isLength({ max: 255 }).withMessage('Name must be at most 255 characters'),
    body('academy_email')
        .notEmpty().withMessage('Academy Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('street')
        .notEmpty().withMessage('Street address is required'),
    body('city')
        .notEmpty().withMessage('City name is required'),
    body('state')
        .notEmpty().withMessage('State/Province  name is required'),
    body('postal_code')
        .notEmpty().withMessage('Postal code is required'),
    body('country')
        .notEmpty().withMessage('Country name is required'),
    body('establishment_date')
        .optional()
        .isDate().withMessage('Establishment date must be a valid date'),
    body('website')
        .optional()
        .isURL().withMessage('Website must be a valid URL'),
]

const updateAcademyValidation = [
    body('name')
        .optional()
        .isLength({ max: 255 }).withMessage('Name must be at most 255 characters'),
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .optional()
        .isString().withMessage('Phone must be a string')
        .isLength({ min: 7, max: 20 }).withMessage('Phone number must be between 7 and 20 characters')
        .matches(phoneRegex).withMessage('Phone number contains invalid characters'),
    body('owner_phone')
        .optional()
        .isString().withMessage('Owner phone must be a string')
        .isLength({ min: 7, max: 20 }).withMessage('Owner phone must be between 7 and 20 characters')
        .matches(phoneRegex).withMessage('Owner phone contains invalid characters'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status value')
];

module.exports = {
    createAcademyValidation,
    updateAcademyValidation
};