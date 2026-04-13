const router = require('../router')();
const { protect, restrictTo } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
    createStudentProfileValidation,
    createParentProfileValidation,
    linkParentStudentValidation,
    idParamValidation
} = require('../../validations/profileValidation');
const studentController = require('../../controllers/studentProfileController');
const parentController = require('../../controllers/parentProfileController');
const linkController = require('../../controllers/parentStudentLinkController'); // Ensure this is correct

// All routes protected
router.use(protect);

// Student profile self-access
router.get('/students/me', studentController.getMyProfile);

// Student profiles (admin & teacher can view, admin can create/update/delete)
router.route('/students')
    .get(restrictTo('admin', 'teacher'), studentController.getAll)
    .post(restrictTo('admin'), createStudentProfileValidation, validate, studentController.create);

router.route('/students/:id')
    .get(restrictTo('admin', 'teacher'), idParamValidation, validate, studentController.getById)
    .patch(restrictTo('admin'), idParamValidation, validate, studentController.update)
    .delete(restrictTo('admin'), idParamValidation, validate, studentController.delete);

// Parent profile self-access
router.get('/parents/me', parentController.getMyProfile);

// Parent profiles
router.route('/parents')
    .get(restrictTo('admin'), parentController.getAll)
    .post(restrictTo('admin'), createParentProfileValidation, validate, parentController.create);

router.route('/parents/:id')
    .get(restrictTo('admin'), idParamValidation, validate, parentController.getById)
    .patch(restrictTo('admin'), idParamValidation, validate, parentController.update)
    .delete(restrictTo('admin'), idParamValidation, validate, parentController.delete);

// Parent-Student linking (using linkController)
router.post('/links', restrictTo('admin'), linkParentStudentValidation, validate, linkController.link);
router.get('/students/:studentId/parents', restrictTo('admin', 'teacher'), linkController.getParentsByStudent);
router.get('/parents/:parentId/students', restrictTo('admin', 'teacher'), linkController.getStudentsByParent);
router.delete('/links/:parentId/:studentId', restrictTo('admin'), linkController.unlink);
router.patch('/links/:id', restrictTo('admin'), linkController.updateLink);

module.exports = router;