const { body, param } = require('express-validator');
const phoneRegex = /^[+]?[\d\s\-().]+$/;

const createStudentProfileValidation = [
    body('academy_id').isInt().withMessage('Academy ID required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('full_name').notEmpty().withMessage('Full name required'),
    body('class_grade_id').optional().isInt(),
    body('roll_number').optional().isString(),
    body('admission_number').optional().isString(),
    body('date_of_birth').optional().isDate(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('emergency_contact_phone').optional().matches(phoneRegex)
];

const createParentProfileValidation = [
    body('academy_id').isInt(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').notEmpty(),
    body('phone').optional().matches(phoneRegex)
];

const linkParentStudentValidation = [
    body('academy_id').isInt(),
    body('parent_id').isInt(),
    body('student_id').isInt(),
    body('relation').isIn(['father', 'mother', 'guardian', 'other']),
    body('is_primary').optional().isBoolean()
];

const idParamValidation = [param('id').isInt()];

module.exports = {
    createStudentProfileValidation,
    createParentProfileValidation,
    linkParentStudentValidation,
    idParamValidation
};