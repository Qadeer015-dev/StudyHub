const { body, param } = require('express-validator');

const createClassGradeValidation = [
    body('academy_id').isInt().withMessage('Academy ID required'),
    body('name').notEmpty().withMessage('Name required'),
    body('display_name').notEmpty().withMessage('Display name required'),
    body('grade_level').isInt({ min: 0 }).withMessage('Grade level must be a positive integer'),
    body('description').optional().isString()
];

const createSubjectValidation = [
    body('academy_id').isInt().withMessage('Academy ID required'),
    body('name').notEmpty().withMessage('Name required'),
    body('display_name').notEmpty().withMessage('Display name required'),
    body('subject_code').optional().isString(),
    body('difficulty_level').optional().isIn(['beginner', 'intermediate', 'advanced'])
];

const assignSubjectValidation = [
    body('academy_id').isInt().withMessage('Academy ID required'),
    body('class_grade_id').isInt().withMessage('Class grade ID required'),
    body('subject_id').isInt().withMessage('Subject ID required'),
    body('is_compulsory').optional().isBoolean()
];

const idParamValidation = [
    param('id').isInt().withMessage('Invalid ID')
];

module.exports = {
    createClassGradeValidation,
    createSubjectValidation,
    assignSubjectValidation,
    idParamValidation
};