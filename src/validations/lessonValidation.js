const { body, param, query } = require('express-validator');

const createLessonValidation = [
    body('class_subject_id').isInt().withMessage('Class subject ID required'),
    body('title').notEmpty().withMessage('Title required'),
    body('lesson_order').isInt({ min: 1 }).withMessage('Lesson order must be a positive integer'),
    body('chapter_number').optional().isInt(),
    body('chapter_name').optional().isString(),
    body('estimated_duration_minutes').optional().isInt({ min: 1 })
];

const updateProgressValidation = [
    body('lesson_id').isInt().withMessage('Lesson ID required'),
    body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'revised']),
    body('mastery_level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('notes').optional().isString()
];

const idParamValidation = [param('id').isInt()];
const classSubjectParamValidation = [param('classSubjectId').isInt()];
const studentIdParamValidation = [param('studentId').isInt()];
const lessonIdParamValidation = [param('lessonId').isInt()];

module.exports = {
    createLessonValidation,
    updateProgressValidation,
    idParamValidation,
    classSubjectParamValidation,
    studentIdParamValidation,
    lessonIdParamValidation
};