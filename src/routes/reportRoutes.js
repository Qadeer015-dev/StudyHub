const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    generateAttendanceReportValidation,
    generatePerformanceReportValidation,
    generateFeeReportValidation,
    generateExamReportValidation,
    idParamValidation
} = require('../validations/reportValidation');
const controller = require('../controllers/reportController');

router.use(protect);

// Generate reports (teachers/admins)
router.get('/reports/attendance', restrictTo('admin', 'teacher'), generateAttendanceReportValidation, validate, controller.generateAttendanceReport);
router.get('/reports/performance', restrictTo('admin', 'teacher'), generatePerformanceReportValidation, validate, controller.generatePerformanceReport);
router.get('/reports/fee', restrictTo('admin', 'teacher'), generateFeeReportValidation, validate, controller.generateFeeReport);
router.get('/reports/exam', restrictTo('admin', 'teacher'), generateExamReportValidation, validate, controller.generateExamReport);

// Manage reports
router.get('/reports', restrictTo('admin', 'teacher'), controller.getAllReports);
router.get('/reports/:id', restrictTo('admin', 'teacher'), idParamValidation, validate, controller.getReportById);
router.get('/reports/:id/download', restrictTo('admin', 'teacher'), idParamValidation, validate, controller.downloadReport);
router.delete('/reports/:id', restrictTo('admin'), idParamValidation, validate, controller.deleteReport);

module.exports = router;