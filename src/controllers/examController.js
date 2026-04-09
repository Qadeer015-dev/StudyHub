const ExamService = require('../services/examService');

exports.createExam = async (req, res, next) => {
    try {
        const result = await ExamService.createExam(req.body, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAllExams = async (req, res, next) => {
    try {
        const exams = await ExamService.getAllExams(req.user.academy_id, req.query);
        res.json({ success: true, data: exams });
    } catch (error) { next(error); }
};

exports.getExamById = async (req, res, next) => {
    try {
        const exam = await ExamService.getExamById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: exam });
    } catch (error) { next(error); }
};

exports.updateExam = async (req, res, next) => {
    try {
        const result = await ExamService.updateExam(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.deleteExam = async (req, res, next) => {
    try {
        const result = await ExamService.deleteExam(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.addTestResult = async (req, res, next) => {
    try {
        const result = await ExamService.addTestResult(req.body, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.addBulkResults = async (req, res, next) => {
    try {
        const testId = req.params.testId;
        const result = await ExamService.addBulkResults(testId, req.body.results, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getTestResults = async (req, res, next) => {
    try {
        const results = await ExamService.getTestResults(req.params.testId, req.user.academy_id);
        res.json({ success: true, data: results });
    } catch (error) { next(error); }
};

exports.getStudentResults = async (req, res, next) => {
    try {
        const results = await ExamService.getStudentResults(req.params.studentId, req.user.academy_id);
        res.json({ success: true, data: results });
    } catch (error) { next(error); }
};

exports.getMyResults = async (req, res, next) => {
    try {
        const results = await ExamService.getMyResults(req.user.id, req.user.academy_id);
        res.json({ success: true, data: results });
    } catch (error) { next(error); }
};

exports.updateResult = async (req, res, next) => {
    try {
        const result = await ExamService.updateResult(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};