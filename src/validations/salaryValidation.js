const { body, param } = require('express-validator');

const createSalaryStructureValidation = [
    body('teacher_id').isInt(),
    body('salary_type').isIn(['monthly', 'hourly', 'per_class']),
    body('base_salary').isFloat({ min: 0 }),
    body('effective_from').isDate(),
    body('qualification_bonus').optional().isFloat({ min: 0 }),
    body('performance_bonus').optional().isFloat({ min: 0 })
];

const recordPaymentValidation = [
    body('teacher_id').isInt(),
    body('amount').isFloat({ min: 0 }),
    body('payment_date').isDate(),
    body('payment_method').isIn(['bank_transfer', 'cash', 'cheque', 'online']),
    body('for_month').notEmpty(),
    body('for_year').isInt({ min: 2000, max: 2100 }),
    body('deductions').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['pending', 'paid', 'cancelled'])
];

const idParamValidation = [param('id').isInt()];
const teacherIdParamValidation = [param('teacherId').isInt()];

module.exports = {
    createSalaryStructureValidation,
    recordPaymentValidation,
    idParamValidation,
    teacherIdParamValidation
};