const { body, param, query } = require('express-validator');

const generateAttendanceReportValidation = [
    query('studentId').isInt(),
    query('period').matches(/^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/)
];

const generatePerformanceReportValidation = [
    query('studentId').isInt(),
    query('period').notEmpty()
];

const generateFeeReportValidation = [
    query('studentId').isInt(),
    query('period').notEmpty()
];

const generateExamReportValidation = [
    query('examId').isInt()
];

const idParamValidation = [param('id').isInt()];

module.exports = {
    generateAttendanceReportValidation,
    generatePerformanceReportValidation,
    generateFeeReportValidation,
    generateExamReportValidation,
    idParamValidation
};