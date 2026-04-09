const { body, param, query } = require('express-validator');

const createExamValidation = [
    body('title').notEmpty(),
    body('exam_type').isIn(['unit_test', 'mid_term', 'final', 'assignment', 'quiz']),
    body('class_subject_id').isInt(),
    body('total_marks').isFloat({ min: 0 }),
    body('passing_marks').isFloat({ min: 0 }),
    body('scheduled_date').optional().isISO8601().toDate(),
    body('duration_minutes').optional().isInt({ min: 1 })
];

const addResultValidation = [
    body('test_id').isInt(),
    body('student_id').isInt(),
    body('obtained_marks').isFloat({ min: 0 })
];

const bulkResultsValidation = [
    body('results').isArray({ min: 1 }),
    body('results.*.student_id').isInt(),
    body('results.*.obtained_marks').isFloat({ min: 0 }),
    body('results.*.grade').optional().isString(),
    body('results.*.remarks').optional().isString()
];

const idParamValidation = [param('id').isInt()];
const testIdParamValidation = [param('testId').isInt()];
const studentIdParamValidation = [param('studentId').isInt()];

module.exports = {
    createExamValidation,
    addResultValidation,
    bulkResultsValidation,
    idParamValidation,
    testIdParamValidation,
    studentIdParamValidation
};