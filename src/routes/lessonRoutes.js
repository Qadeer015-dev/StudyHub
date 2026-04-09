const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createLessonValidation,
    updateProgressValidation,
    idParamValidation,
    classSubjectParamValidation,
    studentIdParamValidation,
    lessonIdParamValidation
} = require('../validations/lessonValidation');
const controller = require('../controllers/lessonController');

router.use(protect);

// Teacher/Admin lesson management
router.route('/lessons')
    .post(restrictTo('admin', 'teacher'), createLessonValidation, validate, controller.createLesson);

router.route('/lessons/:id')
    .get(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.getLessonById)
    .patch(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.updateLesson)
    .delete(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.deleteLesson);

// Get lessons for a class-subject (teachers, students, parents)
router.get('/class-subjects/:classSubjectId/lessons',
    restrictTo('admin', 'teacher', 'student', 'parent'),
    classSubjectParamValidation, validate,
    controller.getLessonsByClassSubject);

// Student progress (self)
router.post('/progress', restrictTo('student'), updateProgressValidation, validate, controller.updateProgress);
router.get('/my-progress/:classSubjectId', restrictTo('student'), classSubjectParamValidation, validate, controller.getMyProgress);

// Teacher/Admin view student progress
router.get('/students/:studentId/progress/:classSubjectId',
    restrictTo('admin', 'teacher', 'parent'),
    studentIdParamValidation, classSubjectParamValidation, validate,
    controller.getStudentProgress);

// Teacher/Admin view all student progress for a specific lesson
router.get('/lessons/:lessonId/progress',
    restrictTo('admin', 'teacher'),
    lessonIdParamValidation, validate,
    controller.getLessonProgress);

module.exports = router;