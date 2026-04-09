const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createExamValidation,
    addResultValidation,
    bulkResultsValidation,
    idParamValidation,
    testIdParamValidation,
    studentIdParamValidation
} = require('../validations/examValidation');
const controller = require('../controllers/examController');

router.use(protect);

// Exam CRUD (teachers/admin)
router.route('/exams')
    .get(restrictTo('admin', 'teacher'), controller.getAllExams)
    .post(restrictTo('admin', 'teacher'), createExamValidation, validate, controller.createExam);

router.route('/exams/:id')
    .get(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.getExamById)
    .patch(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.updateExam)
    .delete(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.deleteExam);

// Test Results
router.post('/results', restrictTo('admin', 'teacher'), addResultValidation, validate, controller.addTestResult);
router.post('/exams/:testId/results/bulk', restrictTo('admin', 'teacher'), testIdParamValidation, bulkResultsValidation, validate, controller.addBulkResults);

router.get('/exams/:testId/results', restrictTo('admin', 'teacher', 'student', 'parent'), testIdParamValidation, validate, controller.getTestResults);
router.get('/students/:studentId/results', restrictTo('admin', 'teacher', 'parent'), studentIdParamValidation, validate, controller.getStudentResults);
router.get('/my-results', restrictTo('student'), controller.getMyResults);

router.patch('/results/:id', restrictTo('admin', 'teacher'), idParamValidation, validate, controller.updateResult);

module.exports = router;