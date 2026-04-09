const { body, param, query } = require('express-validator');

const createFeeStructureValidation = [
    body('class_grade_id').isInt(),
    body('fee_type').isIn(['tuition', 'transport', 'library', 'lab', 'sports', 'other']),
    body('amount').isFloat({ min: 0 }),
    body('frequency').isIn(['monthly', 'quarterly', 'annually', 'per_semester']),
    body('effective_from').isDate()
];

const recordPaymentValidation = [
    body('student_id').isInt(),
    body('amount').isFloat({ min: 0 }),
    body('payment_date').isDate(),
    body('payment_method').isIn(['cash', 'bank_transfer', 'card', 'cheque', 'online']),
    body('for_month').notEmpty(),
    body('for_year').isInt({ min: 2000, max: 2100 })
];

const idParamValidation = [param('id').isInt()];
const studentIdParamValidation = [param('studentId').isInt()];

module.exports = {
    createFeeStructureValidation,
    recordPaymentValidation,
    idParamValidation,
    studentIdParamValidation
};