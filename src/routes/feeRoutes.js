const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createFeeStructureValidation,
    recordPaymentValidation,
    idParamValidation,
    studentIdParamValidation
} = require('../validations/feeValidation');
const controller = require('../controllers/feeController');

router.use(protect);

// Fee Structures (admin only)
router.route('/fee-structures')
    .get(restrictTo('admin'), controller.getAllFeeStructures)
    .post(restrictTo('admin'), createFeeStructureValidation, validate, controller.createFeeStructure);

router.route('/fee-structures/:id')
    .patch(restrictTo('admin'), idParamValidation, validate, controller.updateFeeStructure)
    .delete(restrictTo('admin'), idParamValidation, validate, controller.deleteFeeStructure);

// Payments
router.route('/payments')
    .get(restrictTo('admin'), controller.getAllPayments)
    .post(restrictTo('admin'), recordPaymentValidation, validate, controller.recordPayment);

router.route('/payments/:id')
    .get(restrictTo('admin'), idParamValidation, validate, controller.getPaymentById)
    .patch(restrictTo('admin'), idParamValidation, validate, controller.updatePayment)
    .delete(restrictTo('admin'), idParamValidation, validate, controller.deletePayment);

// Student-specific
router.get('/students/:studentId/payments', restrictTo('admin', 'parent'), studentIdParamValidation, validate, controller.getStudentPayments);
router.get('/students/:studentId/fee-status', restrictTo('admin', 'parent'), studentIdParamValidation, validate, controller.getStudentFeeStatus);
router.get('/my-payments', restrictTo('student'), controller.getMyPayments);

module.exports = router;