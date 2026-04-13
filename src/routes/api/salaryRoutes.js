const router = require('../router')();
const { protect, restrictTo } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
    createSalaryStructureValidation,
    recordPaymentValidation,
    idParamValidation,
    teacherIdParamValidation
} = require('../../validations/salaryValidation');
const controller = require('../../controllers/salaryController');

router.use(protect);

// Salary Structures (admin only)
router.route('/salary-structures')
    .get(restrictTo('admin'), controller.getAllSalaryStructures)
    .post(restrictTo('admin'), createSalaryStructureValidation, validate, controller.createSalaryStructure);

router.route('/salary-structures/:id')
    .patch(restrictTo('admin'), idParamValidation, validate, controller.updateSalaryStructure)
    .delete(restrictTo('admin'), idParamValidation, validate, controller.deleteSalaryStructure);

// Salary Payments
router.route('/salary-payments')
    .get(restrictTo('admin'), controller.getAllPayments)
    .post(restrictTo('admin'), recordPaymentValidation, validate, controller.recordPayment);

router.route('/salary-payments/:id')
    .get(restrictTo('admin'), idParamValidation, validate, controller.getPaymentById)
    .patch(restrictTo('admin'), idParamValidation, validate, controller.updatePayment)
    .delete(restrictTo('admin'), idParamValidation, validate, controller.deletePayment);

// Teacher-specific
router.get('/teachers/:teacherId/salaries', restrictTo('admin', 'teacher'), teacherIdParamValidation, validate, controller.getTeacherSalaries);
router.get('/teachers/:teacherId/payments', restrictTo('admin', 'teacher'), teacherIdParamValidation, validate, controller.getTeacherPayments);
router.get('/my-salaries', restrictTo('teacher'), controller.getMySalaries);
router.get('/my-salary-payments', restrictTo('teacher'), controller.getMyPayments);

module.exports = router;