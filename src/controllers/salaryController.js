const SalaryService = require('../services/salaryService');

exports.createSalaryStructure = async (req, res, next) => {
    try {
        const result = await SalaryService.createSalaryStructure(req.body, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAllSalaryStructures = async (req, res, next) => {
    try {
        const structures = await SalaryService.getAllSalaryStructures(req.user.academy_id, req.query);
        res.json({ success: true, data: structures });
    } catch (error) { next(error); }
};

exports.getTeacherSalaries = async (req, res, next) => {
    try {
        const salaries = await SalaryService.getTeacherSalaries(req.params.teacherId, req.user.academy_id);
        res.json({ success: true, data: salaries });
    } catch (error) { next(error); }
};

exports.getMySalaries = async (req, res, next) => {
    try {
        const salaries = await SalaryService.getMySalaries(req.user.id, req.user.academy_id);
        res.json({ success: true, data: salaries });
    } catch (error) { next(error); }
};

exports.updateSalaryStructure = async (req, res, next) => {
    try {
        const result = await SalaryService.updateSalaryStructure(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.deleteSalaryStructure = async (req, res, next) => {
    try {
        const result = await SalaryService.deleteSalaryStructure(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.recordPayment = async (req, res, next) => {
    try {
        const result = await SalaryService.recordPayment(req.body, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAllPayments = async (req, res, next) => {
    try {
        const payments = await SalaryService.getAllPayments(req.user.academy_id, req.query);
        res.json({ success: true, data: payments });
    } catch (error) { next(error); }
};

exports.getTeacherPayments = async (req, res, next) => {
    try {
        const payments = await SalaryService.getTeacherPayments(req.params.teacherId, req.user.academy_id);
        res.json({ success: true, data: payments });
    } catch (error) { next(error); }
};

exports.getMyPayments = async (req, res, next) => {
    try {
        const payments = await SalaryService.getMyPayments(req.user.id, req.user.academy_id);
        res.json({ success: true, data: payments });
    } catch (error) { next(error); }
};

exports.getPaymentById = async (req, res, next) => {
    try {
        const payment = await SalaryService.getPaymentById(req.params.id, req.user.academy_id);
        res.json({ success: true, data: payment });
    } catch (error) { next(error); }
};

exports.updatePayment = async (req, res, next) => {
    try {
        const result = await SalaryService.updatePayment(req.params.id, req.body, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.deletePayment = async (req, res, next) => {
    try {
        const result = await SalaryService.deletePayment(req.params.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};