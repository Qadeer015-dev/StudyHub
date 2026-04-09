const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createTaskValidation,
    assignValidation,
    submitValidation,
    gradeValidation,
    idParamValidation,
    taskIdParamValidation,
    studentIdParamValidation
} = require('../validations/homeworkValidation');
const controller = require('../controllers/homeworkController');

router.use(protect);

// Teacher/Admin task management
router.route('/tasks')
    .get(restrictTo('admin', 'teacher'), controller.getAllTasks)
    .post(restrictTo('admin', 'teacher'), createTaskValidation, validate, controller.createTask);

router.route('/tasks/:id')
    .get(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.getTaskById)
    .patch(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.updateTask)
    .delete(restrictTo('admin', 'teacher'), idParamValidation, validate, controller.deleteTask);

router.post('/tasks/:taskId/assign', restrictTo('admin', 'teacher'), taskIdParamValidation, assignValidation, validate, controller.assignToStudents);

// View submissions (teacher/admin)
router.get('/tasks/:taskId/submissions', restrictTo('admin', 'teacher'), taskIdParamValidation, validate, controller.getSubmissions);
router.patch('/submissions/:submissionId/grade', restrictTo('admin', 'teacher'), gradeValidation, validate, controller.gradeSubmission);

// Student homework
router.get('/students/me', restrictTo('student'), controller.getMyHomework);
router.post('/tasks/:taskId/submit', restrictTo('student'), taskIdParamValidation, submitValidation, validate, controller.submitHomework);

// Teacher/Admin/Parent viewing specific student's homework
router.get('/students/:studentId', restrictTo('admin', 'teacher', 'parent'), studentIdParamValidation, validate, controller.getStudentHomework);

module.exports = router;