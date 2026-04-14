const router = require('../router')();
const { protect } = require('../../middlewares/auth');
const dashboardController = require('../../controllers/dashboardController');

router.use(protect);
router.get('/', dashboardController.getDashboard);

module.exports = router;