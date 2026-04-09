const ParentProfileService = require('../services/parentProfileService');

exports.create = async (req, res, next) => {
    try {
        const result = await ParentProfileService.create(req.body, req.user.id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAll = async (req, res, next) => {
    try {
        const academyId = req.user.academy_id || req.query.academy_id;
        const profiles = await ParentProfileService.getAll(academyId);
        res.json({ success: true, data: profiles });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const profile = await ParentProfileService.getById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: profile });
    } catch (error) { next(error); }
};

exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await ParentProfileService.getMyProfile(req.user.id, req.user.academy_id);
        res.json({ success: true, data: profile });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const result = await ParentProfileService.update(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await ParentProfileService.delete(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};