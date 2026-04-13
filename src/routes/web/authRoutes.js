const router = require('../router')();

router.get('/register', (req, res)=>{
    res.render('auth/register');
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

module.exports = router;