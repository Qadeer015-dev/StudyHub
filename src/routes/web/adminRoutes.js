const router = require('../router')();
const ClassGradeService = require('../../services/classGradeService');

router.get('/settings', (req, res) => {
    res.render('admin/settings');
})

router.get('/manage-users', (req, res) => {
    res.render('admin/user_management');
})

// classes 
router.get('/classes', (req, res) => {
    res.render('classes/index');
})

router.get('/classes/new', (req, res) => {
    res.render('classes/new');
})

router.get('/classes/:classId', async (req, res) => {
    const grade = await ClassGradeService.getById(req.params.classId, req.user.academy_id);
    res.render('classes/show', { grade });
})

router.get('/classes/:classId/edit', (req, res) => {
    res.render('classes/edit');
})

// class subjects
router.get('/classes/:classId/subjects', (req, res) => {
    res.render('classes/subjects/index');
})

router.get('/classes/:classId/subjects/new', (req, res) => {
    res.render('classes/subjects/new');
})

router.get('/classes/:classId/subjects/:subjectId', (req, res) => {
    res.render('classes/subjects/show');
})

router.get('/classes/:classId/subjects/:subjectId/edit', (req, res) => {
    res.render('classes/subjects/edit');
})

//students 
router.get('/students', (req, res) => {
    res.render('students');
})

router.get('/students/new', (req, res) => {
    res.render('students/new');
})

router.get('/students/:studentId', (req, res) => {
    res.render('students/show');
})

router.get('/students/:studentId/edit', (req, res) => {
    res.render('students/edit');
})

//teachers 
router.get('/teachers', (req, res) => {
    res.render('teachers');
})

router.get('/teachers/new', (req, res) => {
    res.render('teachers/new');
})

router.get('/teachers/:studentId', (req, res) => {
    res.render('teachers/show');
})

router.get('/teachers/:studentId/edit', (req, res) => {
    res.render('teachers/edit');
})

module.exports = router;