const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createClassGradeValidation,
    createSubjectValidation,
    assignSubjectValidation,
    idParamValidation
} = require('../validations/classValidation');
const controller = require('../controllers/classController');

// All routes protected
router.use(protect);

// Class Grades
router.route('/grades')
    .get(controller.getClassGrades)
    .post(restrictTo('admin'), createClassGradeValidation, validate, controller.createClassGrade);

router.route('/grades/:id')
    .get(idParamValidation, validate, controller.getClassGrade)
    .patch(restrictTo('admin'), idParamValidation, validate, controller.updateClassGrade)
    .delete(restrictTo('admin'), idParamValidation, validate, controller.deleteClassGrade);

// Subjects
router.route('/subjects')
    .get(controller.getSubjects)
    .post(restrictTo('admin'), createSubjectValidation, validate, controller.createSubject);

router.route('/subjects/:id')
    .get(idParamValidation, validate, controller.getSubject)
    .patch(restrictTo('admin'), idParamValidation, validate, controller.updateSubject)
    .delete(restrictTo('admin'), idParamValidation, validate, controller.deleteSubject);

// Class-Subject Mappings
router.post('/assign', restrictTo('admin'), assignSubjectValidation, validate, controller.assignSubject);
router.get('/classes/:classId/subjects', controller.getClassSubjects);
router.get('/subjects/:subjectId/classes', controller.getSubjectClasses);
router.patch('/mappings/:id', restrictTo('admin'), idParamValidation, validate, controller.updateMapping);
router.delete('/mappings/:id', restrictTo('admin'), idParamValidation, validate, controller.removeMapping);

module.exports = router;