const HomeworkService = require('../services/homeworkService');

exports.createTask = async (req, res, next) => {
    try {
        const result = await HomeworkService.createTask(req.body, req.user.id, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.assignToStudents = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const { student_ids } = req.body;
        const result = await HomeworkService.assignToStudents(taskId, student_ids, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await HomeworkService.getAllTasks(req.user.academy_id, req.query);
        res.json({ success: true, data: tasks });
    } catch (error) { next(error); }
};

exports.getTaskById = async (req, res, next) => {
    try {
        const task = await HomeworkService.getTaskById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: task });
    } catch (error) { next(error); }
};

exports.updateTask = async (req, res, next) => {
    try {
        const result = await HomeworkService.updateTask(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const result = await HomeworkService.deleteTask(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getMyHomework = async (req, res, next) => {
    try {
        const homework = await HomeworkService.getMyHomework(req.user.id, req.user.academy_id, req.query);
        res.json({ success: true, data: homework });
    } catch (error) { next(error); }
};

exports.getStudentHomework = async (req, res, next) => {
    try {
        const homework = await HomeworkService.getStudentHomework(req.params.studentId, req.user.academy_id, req.query);
        res.json({ success: true, data: homework });
    } catch (error) { next(error); }
};

exports.getSubmissions = async (req, res, next) => {
    try {
        const submissions = await HomeworkService.getSubmissions(req.params.taskId, req.user.academy_id);
        res.json({ success: true, data: submissions });
    } catch (error) { next(error); }
};

exports.submitHomework = async (req, res, next) => {
    try {
        const result = await HomeworkService.submitHomework(req.user.id, req.params.taskId, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.gradeSubmission = async (req, res, next) => {
    try {
        const result = await HomeworkService.gradeSubmission(req.params.submissionId, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};