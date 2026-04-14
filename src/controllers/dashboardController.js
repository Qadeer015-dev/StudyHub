const DashboardService = require('../services/dashboardService');
const StudentProfileModel = require('../models/studentProfileModel');
const ParentProfileModel = require('../models/parentProfileModel');
const AppError = require('../utils/AppError');

exports.getDashboard = async (req, res, next) => {
    try {
        const { id: userId, academy_id: academyId, roles } = req.user;
        let data;

        // Determine role and call appropriate service
        if (roles.some(r => r.role === 'admin')) {
            data = await DashboardService.getAdminDashboard(academyId);
        } else if (roles.some(r => r.role === 'teacher')) {
            data = await DashboardService.getTeacherDashboard(userId, academyId);
        } else if (roles.some(r => r.role === 'student')) {
            const student = await StudentProfileModel.findByUserId(userId, academyId);
            if (!student) throw new AppError('Student profile not found', 404);
            data = await DashboardService.getStudentDashboard(student.id, academyId);
        } else if (roles.some(r => r.role === 'parent')) {
            const parent = await ParentProfileModel.findByUserId(userId, academyId);
            if (!parent) throw new AppError('Parent profile not found', 404);
            data = await DashboardService.getParentDashboard(parent.id, academyId);
        } else {
            throw new AppError('Invalid role for dashboard', 403);
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};