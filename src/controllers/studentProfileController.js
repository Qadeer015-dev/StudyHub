const StudentProfileService = require('../services/studentProfileService');

exports.create = async (req, res, next) => {
    try {
        const result = await StudentProfileService.create(req.body, req.user.id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const academyId = req.user.academy_id || req.query.academy_id;
        const profiles = await StudentProfileService.getAll(academyId, req.query);
        res.json({ success: true, data: profiles });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const profile = await StudentProfileService.getById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: profile });
    } catch (error) { next(error); }
};

exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await StudentProfileService.getMyProfile(req.user.id, req.user.academy_id);
        res.json({ success: true, data: profile });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const result = await StudentProfileService.update(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await StudentProfileService.delete(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};