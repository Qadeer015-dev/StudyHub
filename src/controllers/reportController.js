const PDFReportService = require('../services/pdfReportService');
const path = require('path');

exports.generateAttendanceReport = async (req, res, next) => {
  try {
    const { studentId, period } = req.query;
    const result = await PDFReportService.generateAttendanceReport(
      parseInt(studentId), period, req.user.id, req.user.academy_id
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.generatePerformanceReport = async (req, res, next) => {
  try {
    const { studentId, period } = req.query;
    const result = await PDFReportService.generatePerformanceReport(
      parseInt(studentId), period, req.user.id, req.user.academy_id
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.generateFeeReport = async (req, res, next) => {
  try {
    const { studentId, period } = req.query;
    const result = await PDFReportService.generateFeeReport(
      parseInt(studentId), period, req.user.id, req.user.academy_id
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.generateExamReport = async (req, res, next) => {
  try {
    const { examId } = req.query;
    const result = await PDFReportService.generateExamReport(
      parseInt(examId), req.user.id, req.user.academy_id
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await PDFReportService.getAllReports(req.user.academy_id, req.query);
    res.json({ success: true, data: reports });
  } catch (error) { next(error); }
};

exports.getReportById = async (req, res, next) => {
  try {
    const report = await PDFReportService.getReportById(req.params.id, req.user.academy_id);
    res.json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.downloadReport = async (req, res, next) => {
  try {
    const filePath = await PDFReportService.downloadReport(req.params.id, req.user.academy_id);
    res.download(filePath);
  } catch (error) { next(error); }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const result = await PDFReportService.deleteReport(req.params.id, req.user.academy_id);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};