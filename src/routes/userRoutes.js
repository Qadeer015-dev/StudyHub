const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');
const {
    updateUserValidation,
    assignRoleValidation,
    resetPasswordValidation,
    userIdParamValidation
} = require('../validations/userValidation');
const validate = require('../middlewares/validate');

// All routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.get('/profile', (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});

router.patch(
    '/profile',
    updateUserValidation,
    validate,
    (req, res, next) => {
        req.params.id = req.user.id;
        next();
    },
    UserController.update
);

// Admin-only routes
router.use(restrictTo('admin'));

router.get('/', UserController.getAll);
router.get('/:id', userIdParamValidation, validate, UserController.getById);
router.patch('/:id', userIdParamValidation, updateUserValidation, validate, UserController.update);
router.delete('/:id', userIdParamValidation, validate, UserController.delete);

// Role management
router.post('/:id/roles', userIdParamValidation, assignRoleValidation, validate, UserController.assignRole);
router.delete('/:id/roles', userIdParamValidation, assignRoleValidation, validate, UserController.revokeRole);

// Password reset (admin only)
router.post('/:id/reset-password', userIdParamValidation, resetPasswordValidation, validate, UserController.resetPassword);

module.exports = router;