const { body, param, query } = require('express-validator');

const createTaskValidation = [
    body('title').notEmpty().withMessage('Title required'),
    body('class_grade_id').optional().isInt(),
    body('subject_id').optional().isInt(),
    body('due_date').optional().isISO8601().toDate(),
    body('max_points').optional().isFloat({ min: 0 })
];

const assignValidation = [
    body('student_ids').isArray({ min: 1 }).withMessage('Student IDs array required'),
    body('student_ids.*').isInt().withMessage('Each student ID must be an integer')
];

const submitValidation = [
    body('submission_file_url').optional().isURL(),
    body('student_comments').optional().isString()
];

const gradeValidation = [
    body('marks_obtained').optional().isFloat({ min: 0 }),
    body('teacher_comments').optional().isString()
];

const idParamValidation = [param('id').isInt()];
const taskIdParamValidation = [param('taskId').isInt()];
const studentIdParamValidation = [param('studentId').isInt()];

module.exports = {
    createTaskValidation,
    assignValidation,
    submitValidation,
    gradeValidation,
    idParamValidation,
    taskIdParamValidation,
    studentIdParamValidation
};