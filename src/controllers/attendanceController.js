const AttendanceService = require('../services/attendanceService');

exports.markSingle = async (req, res, next) => {
  try {
    const result = await AttendanceService.markSingle(
      req.body,
      req.user.id,
      req.user.academy_id
    );
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.markBulk = async (req, res, next) => {
  try {
    const result = await AttendanceService.markBulk(
      req.body,
      req.user.id,
      req.user.academy_id
    );
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { start_date, end_date } = req.query;
    const result = await AttendanceService.getStudentAttendance(
      parseInt(studentId),
      start_date,
      end_date,
      req.user.academy_id
    );
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getMyAttendance = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const result = await AttendanceService.getMyAttendance(
      req.user.id,
      start_date,
      end_date,
      req.user.academy_id
    );
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getClassAttendance = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;
    const records = await AttendanceService.getClassAttendance(
      parseInt(classId),
      date,
      req.user.academy_id
    );
    res.json({ success: true, data: records });
  } catch (error) { next(error); }
};

exports.updateAttendance = async (req, res, next) => {
  try {
    const result = await AttendanceService.updateAttendance(
      req.params.id,
      req.body,
      req.user.academy_id
    );
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

exports.deleteAttendance = async (req, res, next) => {
  try {
    const result = await AttendanceService.deleteAttendance(
      req.params.id,
      req.user.academy_id
    );
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};