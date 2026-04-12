const router = require('../router')();
const { protect, restrictTo } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
    markSingleValidation,
    markBulkValidation,
    dateRangeValidation,
    idParamValidation,
    classDateValidation
} = require('../../validations/attendanceValidation');
const controller = require('../../controllers/attendanceController');

// All routes protected
router.use(protect);

// Teacher/Admin can mark attendance
router.post('/mark', restrictTo('admin', 'teacher'), markSingleValidation, validate, controller.markSingle);
router.post('/mark/bulk', restrictTo('admin', 'teacher'), markBulkValidation, validate, controller.markBulk);

// View attendance
router.get('/students/:studentId', restrictTo('admin', 'teacher', 'parent'), dateRangeValidation, validate, controller.getStudentAttendance);
router.get('/classes/:classId', restrictTo('admin', 'teacher'), classDateValidation, validate, controller.getClassAttendance);
router.get('/me', restrictTo('student'), dateRangeValidation, validate, controller.getMyAttendance);

// Modify attendance
router.patch('/:id', restrictTo('admin', 'teacher'), idParamValidation, validate, controller.updateAttendance);
router.delete('/:id', restrictTo('admin'), idParamValidation, validate, controller.deleteAttendance);

module.exports = router;