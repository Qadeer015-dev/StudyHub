const FeeService = require('../services/feeService');

exports.createFeeStructure = async (req, res, next) => {
  try {
    const result = await FeeService.createFeeStructure(req.body, req.user.academy_id);
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.getAllFeeStructures = async (req, res, next) => {
  try {
    const structures = await FeeService.getAllFeeStructures(req.user.academy_id, req.query);
    res.json({ success: true, data: structures });
  } catch (error) { next(error); }
};

exports.updateFeeStructure = async (req, res, next) => {
  try {
    const result = await FeeService.updateFeeStructure(req.params.id, req.body, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.deleteFeeStructure = async (req, res, next) => {
  try {
    const result = await FeeService.deleteFeeStructure(req.params.id, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.recordPayment = async (req, res, next) => {
  try {
    const result = await FeeService.recordPayment(req.body, req.user.id, req.user.academy_id);
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await FeeService.getAllPayments(req.user.academy_id, req.query);
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
};

exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await FeeService.getPaymentById(req.params.id, req.user.academy_id);
    res.json({ success: true, data: payment });
  } catch (error) { next(error); }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const result = await FeeService.updatePayment(req.params.id, req.body, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.deletePayment = async (req, res, next) => {
  try {
    const result = await FeeService.deletePayment(req.params.id, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.getStudentPayments = async (req, res, next) => {
  try {
    const payments = await FeeService.getStudentPayments(req.params.studentId, req.user.academy_id);
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
};

exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await FeeService.getMyPayments(req.user.id, req.user.academy_id);
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
};

exports.getStudentFeeStatus = async (req, res, next) => {
  try {
    const status = await FeeService.getStudentFeeStatus(req.params.studentId, req.user.academy_id);
    res.json({ success: true, data: status });
  } catch (error) { next(error); }
};