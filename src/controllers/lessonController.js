const LessonService = require('../services/lessonService');

exports.createLesson = async (req, res, next) => {
  try {
    const result = await LessonService.create(req.body, req.user.academy_id);
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.getLessonsByClassSubject = async (req, res, next) => {
  try {
    const lessons = await LessonService.getLessonsByClassSubject(req.params.classSubjectId, req.user.academy_id);
    res.json({ success: true, data: lessons });
  } catch (error) { next(error); }
};

exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await LessonService.getLessonById(req.params.id, req.user.academy_id);
    res.json({ success: true, data: lesson });
  } catch (error) { next(error); }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const result = await LessonService.updateLesson(req.params.id, req.body, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const result = await LessonService.deleteLesson(req.params.id, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const result = await LessonService.updateProgress(req.user.id, req.body, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.getMyProgress = async (req, res, next) => {
  try {
    const classSubjectId = req.params.classSubjectId;
    const progress = await LessonService.getMyProgress(req.user.id, classSubjectId, req.user.academy_id);
    res.json({ success: true, data: progress });
  } catch (error) { next(error); }
};

exports.getStudentProgress = async (req, res, next) => {
  try {
    const { studentId, classSubjectId } = req.params;
    const progress = await LessonService.getStudentProgress(studentId, classSubjectId, req.user.academy_id);
    res.json({ success: true, data: progress });
  } catch (error) { next(error); }
};

exports.getLessonProgress = async (req, res, next) => {
  try {
    const progress = await LessonService.getLessonProgress(req.params.lessonId, req.user.academy_id);
    res.json({ success: true, data: progress });
  } catch (error) { next(error); }
};