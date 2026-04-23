const router = require('../router')();
const AuthController = require('../../controllers/authController');

router.get('/register', (req, res)=>{
    res.render('auth/register');
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password');
})

router.post("/api/v1/auth/forgot-password", AuthController.forgotPassword);

module.exports = router;
