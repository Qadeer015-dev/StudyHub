const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const validators = require('../middleware/validation');

// Import controllers
const authController = require('../controllers/authController');
const attendanceController = require('../controllers/attendanceController');
const lessonController = require('../controllers/lessonController');
const testController = require('../controllers/testController');
const feeController = require('../controllers/feeController');
const reportController = require('../controllers/reportController');

// ==================== Auth Routes ====================
// Public routes
router.post('/auth/register/admin', validators.registerAdmin, authController.registerAdmin);
router.post('/auth/register/student', validators.registerStudent, authController.registerStudent);
router.post('/auth/register/parent', validators.registerParent, authController.registerParent);
router.post('/auth/login', validators.login, authController.login);

// Protected auth routes
router.get('/auth/profile', authenticate, authController.getProfile);
router.put('/auth/profile', authenticate, validators.updateProfile, authController.updateProfile);
router.post('/auth/change-password', authenticate, authController.changePassword);

// ==================== Attendance Routes ====================
router.post('/attendance', authenticate, authorize('admin'), validators.markAttendance, attendanceController.markAttendance);
router.post('/attendance/bulk', authenticate, authorize('admin'), validators.bulkAttendance, attendanceController.bulkMarkAttendance);
router.get('/attendance/student/:student_id', authenticate, validators.pagination, attendanceController.getStudentAttendance);
router.get('/attendance/class/:class_id/report', authenticate, authorize('admin'), attendanceController.getClassAttendanceReport);
router.get('/attendance/daily/:date', authenticate, attendanceController.getDailyAttendanceSummary);
router.put('/attendance/:id', authenticate, authorize('admin'), attendanceController.updateAttendance);
router.delete('/attendance/:id', authenticate, authorize('admin'), attendanceController.deleteAttendance);

// ==================== Lesson Routes ====================
router.post('/lessons', authenticate, authorize('admin'), validators.createLesson, lessonController.createLesson);
router.get('/lessons/class-subject/:class_subject_id', lessonController.getLessons);
router.get('/lessons/:id', lessonController.getLesson);
router.put('/lessons/:id', authenticate, authorize('admin'), lessonController.updateLesson);
router.delete('/lessons/:id', authenticate, authorize('admin'), lessonController.deleteLesson);

// Student lesson progress
router.post('/lesson-progress', authenticate, validators.updateLessonProgress, lessonController.updateStudentLessonProgress);
router.get('/lesson-progress/student/:student_id', authenticate, lessonController.getStudentLessonProgress);
router.get('/lesson-progress/current/:student_id', authenticate, lessonController.getCurrentLesson);
router.get('/lesson-progress/class-subject/:class_subject_id/summary', authenticate, authorize('admin'), lessonController.getClassLessonProgressSummary);

// ==================== Test Routes ====================
router.post('/tests', authenticate, authorize('admin'), validators.createTest, testController.createTest);
router.get('/tests/class-subject/:class_subject_id', authenticate, validators.pagination, testController.getTests);
router.get('/tests/:id', authenticate, testController.getTest);
router.put('/tests/:id', authenticate, authorize('admin'), testController.updateTest);
router.delete('/tests/:id', authenticate, authorize('admin'), testController.deleteTest);

// Test results
router.post('/tests/:test_id/results', authenticate, authorize('admin'), validators.addTestResult, testController.addTestResult);
router.post('/tests/:test_id/results/bulk', authenticate, authorize('admin'), testController.addBulkTestResults);
router.get('/tests/:test_id/results', authenticate, validators.pagination, testController.getTestResults);
router.get('/tests/:test_id/statistics', authenticate, testController.getTestStatistics);
router.get('/tests/student/:student_id/history', authenticate, validators.pagination, testController.getStudentTestHistory);
router.get('/tests/class/:class_id/upcoming', authenticate, testController.getUpcomingTests);

// ==================== Fee Routes ====================
router.post('/fees/structure', authenticate, authorize('admin'), validators.createFeeStructure, feeController.createFeeStructure);
router.get('/fees/structure/class/:class_id', authenticate, validators.pagination, feeController.getFeeStructures);
router.put('/fees/structure/:id', authenticate, authorize('admin'), feeController.updateFeeStructure);
router.delete('/fees/structure/:id', authenticate, authorize('admin'), feeController.deleteFeeStructure);

// Fee payments
router.post('/fees/payment', authenticate, authorize('admin'), validators.recordFeePayment, feeController.recordFeePayment);
router.get('/fees/student/:student_id', authenticate, validators.pagination, feeController.getStudentFeePayments);
router.get('/fees/class/:class_id/pending', authenticate, authorize('admin'), feeController.getPendingFees);
router.get('/fees/class/:class_id/report', authenticate, authorize('admin'), feeController.getFeeCollectionReport);
router.get('/fees/defaulters', authenticate, authorize('admin'), feeController.getFeeDefaulters);
router.put('/fees/payment/:id/status', authenticate, authorize('admin'), feeController.updatePaymentStatus);

// ==================== Report Routes ====================
router.post('/reports/progress', authenticate, authorize('admin'), validators.createProgressReport, reportController.createProgressReport);
router.get('/reports/progress/student/:student_id', authenticate, validators.pagination, reportController.getStudentProgressReports);
router.put('/reports/progress/:id', authenticate, authorize('admin'), reportController.updateProgressReport);
router.post('/reports/progress/:id/acknowledge', authenticate, reportController.acknowledgeProgressReport);
router.get('/reports/student/:student_id/report-card', authenticate, reportController.getStudentReportCard);
router.get('/reports/dashboard', authenticate, authorize('admin'), reportController.getDashboardStats);

module.exports = router;