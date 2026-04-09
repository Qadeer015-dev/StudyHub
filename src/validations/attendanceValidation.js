const { body, param, query } = require('express-validator');

const markSingleValidation = [
    body('student_id').isInt().withMessage('Student ID required'),
    body('date').isDate().withMessage('Valid date required (YYYY-MM-DD)'),
    body('status').isIn(['present', 'absent', 'late', 'excused', 'half_day']).withMessage('Invalid status'),
    body('remarks').optional().isString()
];

const markBulkValidation = [
    body('class_grade_id').isInt().withMessage('Class grade ID required'),
    body('date').isDate().withMessage('Valid date required'),
    body('attendance').isArray({ min: 1 }).withMessage('Attendance array required'),
    body('attendance.*.student_id').isInt().withMessage('Student ID required for each entry'),
    body('attendance.*.status').isIn(['present', 'absent', 'late', 'excused', 'half_day']),
    body('attendance.*.remarks').optional().isString()
];

const dateRangeValidation = [
    query('start_date').isDate().withMessage('Start date required (YYYY-MM-DD)'),
    query('end_date').isDate().withMessage('End date required (YYYY-MM-DD)')
];

const idParamValidation = [param('id').isInt().withMessage('Invalid ID')];

const classDateValidation = [
    param('classId').isInt().withMessage('Invalid class ID'),
    query('date').isDate().withMessage('Date required')
];

module.exports = {
    markSingleValidation,
    markBulkValidation,
    dateRangeValidation,
    idParamValidation,
    classDateValidation
};