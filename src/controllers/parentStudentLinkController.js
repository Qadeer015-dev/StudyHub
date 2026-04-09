//parentStudentLinkController.js
const ParentStudentLinkService = require('../services/parentStudentLinkService');

exports.link = async (req, res, next) => {
    try {
        const result = await ParentStudentLinkService.link(req.body);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getParentsByStudent = async (req, res, next) => {
    try {
        const parents = await ParentStudentLinkService.getParentsByStudent(req.params.studentId, req.user.academy_id);
        res.json({ success: true, data: parents });
    } catch (error) { next(error); }
};

exports.getStudentsByParent = async (req, res, next) => {
    try {
        const students = await ParentStudentLinkService.getStudentsByParent(req.params.parentId, req.user.academy_id);
        res.json({ success: true, data: students });
    } catch (error) { next(error); }
};

exports.unlink = async (req, res, next) => {
    try {
        const result = await ParentStudentLinkService.unlink(req.params.parentId, req.params.studentId);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.updateLink = async (req, res, next) => {
    try {
        const result = await ParentStudentLinkService.updateLink(req.params.id, req.body);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};