const ClassGradeService = require('../services/classGradeService');
const SubjectService = require('../services/subjectService');
const ClassSubjectService = require('../services/classSubjectService');

// Class Grade Controllers
exports.createClassGrade = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            academy_id: req.user.academy_id
        };
        const result = await ClassGradeService.create(payload);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getClassGrades = async (req, res, next) => {
    try {
        const academyId = req.query.academy_id || req.user.academy_id;
        const grades = await ClassGradeService.getAll(academyId);
        res.json({ success: true, data: grades });
    } catch (error) { next(error); }
};

exports.getClassGrade = async (req, res, next) => {
    try {
        const grade = await ClassGradeService.getById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: grade });
    } catch (error) { next(error); }
};

exports.updateClassGrade = async (req, res, next) => {
    try {
        const result = await ClassGradeService.update(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.deleteClassGrade = async (req, res, next) => {
    try {
        const result = await ClassGradeService.delete(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

// Subject Controllers
exports.createSubject = async (req, res, next) => {
    try {
        const result = await SubjectService.create(req.body);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getSubjects = async (req, res, next) => {
    try {
        const academyId = req.query.academy_id || req.user.academy_id;
        const subjects = await SubjectService.getAll(academyId);
        res.json({ success: true, data: subjects });
    } catch (error) { next(error); }
};

exports.getSubject = async (req, res, next) => {
    try {
        const subject = await SubjectService.getById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: subject });
    } catch (error) { next(error); }
};

exports.updateSubject = async (req, res, next) => {
    try {
        const result = await SubjectService.update(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.deleteSubject = async (req, res, next) => {
    try {
        const result = await SubjectService.delete(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

// Class-Subject Mapping Controllers
exports.assignSubject = async (req, res, next) => {
    try {
        const result = await ClassSubjectService.assign(req.body);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getClassSubjects = async (req, res, next) => {
    try {
        const mappings = await ClassSubjectService.getByClass(req.params.classId, req.user.academy_id);
        res.json({ success: true, data: mappings });
    } catch (error) { next(error); }
};

exports.getSubjectClasses = async (req, res, next) => {
    try {
        const mappings = await ClassSubjectService.getBySubject(req.params.subjectId, req.user.academy_id);
        res.json({ success: true, data: mappings });
    } catch (error) { next(error); }
};

exports.updateMapping = async (req, res, next) => {
    try {
        const result = await ClassSubjectService.update(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.removeMapping = async (req, res, next) => {
    try {
        const result = await ClassSubjectService.remove(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};