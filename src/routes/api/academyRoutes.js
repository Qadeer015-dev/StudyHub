const router = require('../router')();
const AcademyController = require('../../controllers/academyController');
const { createAcademyValidation, updateAcademyValidation } = require('../../validations/academyValidation');
const validate = require('../../middlewares/validate');

// Public routes (no authentication yet)
router.post(
    '/',
    createAcademyValidation,
    validate,
    AcademyController.create
);

router.get('/', AcademyController.getAll);
router.get('/:id', AcademyController.getById);
router.patch(
    '/:id',
    updateAcademyValidation,
    validate,
    AcademyController.update
);
router.delete('/:id', AcademyController.delete);

module.exports = router;