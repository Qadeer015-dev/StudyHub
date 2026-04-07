const { pool } = require('../config/database');
const dayjs = require('dayjs');

// Mark attendance for a student
const markAttendance = async (req, res) => {
  try {
    const { student_id, date, status, remarks } = req.body;
    const attendanceDate = date || dayjs().format('YYYY-MM-DD');
    const markedBy = req.user.id;

    // Check if attendance already exists for this student on this date
    const [existing] = await pool.execute(
      'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
      [student_id, attendanceDate]
    );

    if (existing.length > 0) {
      // Update existing attendance
      await pool.execute(
        'UPDATE attendance SET status = ?, remarks = ?, marked_by = ? WHERE id = ?',
        [status, remarks, markedBy, existing[0].id]
      );

      return res.json({
        success: true,
        message: 'Attendance updated successfully',
        data: { id: existing[0].id, student_id, date: attendanceDate, status }
      });
    }

    // Insert new attendance
    const [result] = await pool.execute(
      'INSERT INTO attendance (student_id, date, status, remarks, marked_by) VALUES (?, ?, ?, ?, ?)',
      [student_id, attendanceDate, status, remarks, markedBy]
    );

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: { id: result.insertId, student_id, date: attendanceDate, status }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// Bulk mark attendance for multiple students
const bulkMarkAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    const markedBy = req.user.id;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const results = [];
      for (const record of records) {
        const { student_id, status, remarks } = record;

        // Check if attendance already exists
        const [existing] = await connection.execute(
          'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
          [student_id, date]
        );

        if (existing.length > 0) {
          await connection.execute(
            'UPDATE attendance SET status = ?, remarks = ?, marked_by = ? WHERE id = ?',
            [status, remarks, markedBy, existing[0].id]
          );
          results.push({ student_id, status, updated: true });
        } else {
          await connection.execute(
            'INSERT INTO attendance (student_id, date, status, remarks, marked_by) VALUES (?, ?, ?, ?, ?)',
            [student_id, date, status, remarks, markedBy]
          );
          results.push({ student_id, status, updated: false });
        }
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Attendance marked successfully',
        data: { date, count: results.length, results }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// Get attendance for a student
const getStudentAttendance = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { start_date, end_date, status, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT a.*, u.full_name as student_name 
      FROM attendance a 
      JOIN student_profiles sp ON a.student_id = sp.id 
      JOIN users u ON sp.user_id = u.id 
      WHERE a.student_id = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM attendance WHERE student_id = ?';
    let values = [student_id];
    let countValues = [student_id];

    if (start_date) {
      query += ' AND a.date >= ?';
      countQuery += ' AND date >= ?';
      values.push(start_date);
      countValues.push(start_date);
    }

    if (end_date) {
      query += ' AND a.date <= ?';
      countQuery += ' AND date <= ?';
      values.push(end_date);
      countValues.push(end_date);
    }

    if (status) {
      query += ' AND a.status = ?';
      countQuery += ' AND status = ?';
      values.push(status);
      countValues.push(status);
    }

    query += ' ORDER BY a.date DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [attendance] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        attendance,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance',
      error: error.message
    });
  }
};

// Get attendance report for a class
const getClassAttendanceReport = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { start_date, end_date } = req.query;

    const query = `
      SELECT 
        sp.id as student_id,
        u.full_name as student_name,
        u.phone as student_phone,
        COUNT(a.id) as total_days,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_days,
        SUM(CASE WHEN a.status = 'excused' THEN 1 ELSE 0 END) as excused_days,
        ROUND(
          (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100, 2
        ) as attendance_percentage
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN attendance a ON a.student_id = sp.id
      WHERE sp.class_id = ? AND sp.is_active = TRUE
    `;

    let values = [class_id];

    if (start_date) {
      query += ' AND (a.date IS NULL OR a.date >= ?)';
      values.push(start_date);
    }

    if (end_date) {
      query += ' AND (a.date IS NULL OR a.date <= ?)';
      values.push(end_date);
    }

    query += ' GROUP BY sp.id, u.full_name, u.phone ORDER BY u.full_name';

    const [report] = await pool.execute(query, values);

    res.json({
      success: true,
      data: {
        class_id: parseInt(class_id),
        date_range: { start_date, end_date },
        students: report
      }
    });
  } catch (error) {
    console.error('Get class attendance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance report',
      error: error.message
    });
  }
};

// Get daily attendance summary
const getDailyAttendanceSummary = async (req, res) => {
  try {
    const { date } = req.params;
    const { class_id } = req.query;

    let query = `
      SELECT 
        a.status,
        COUNT(*) as count
      FROM attendance a
      JOIN student_profiles sp ON a.student_id = sp.id
      WHERE a.date = ? AND sp.is_active = TRUE
    `;

    let values = [date];

    if (class_id) {
      query += ' AND sp.class_id = ?';
      values.push(class_id);
    }

    query += ' GROUP BY a.status';

    const [summary] = await pool.execute(query, values);

    // Get total students
    let totalQuery = 'SELECT COUNT(*) as total FROM student_profiles WHERE is_active = TRUE';
    let totalValues = [];

    if (class_id) {
      totalQuery += ' AND class_id = ?';
      totalValues = [class_id];
    }

    const [totalResult] = await pool.execute(totalQuery, totalValues);
    const totalStudents = totalResult[0].total;

    const result = {
      date,
      total_students: totalStudents,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      half_day: 0,
      unmarked: 0
    };

    summary.forEach(row => {
      result[row.status] = row.count;
    });

    const markedCount = summary.reduce((sum, row) => sum + row.count, 0);
    result.unmarked = totalStudents - markedCount;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get daily attendance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance summary',
      error: error.message
    });
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const [result] = await pool.execute(
      'UPDATE attendance SET status = ?, remarks = ? WHERE id = ?',
      [status, remarks, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance',
      error: error.message
    });
  }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM attendance WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attendance',
      error: error.message
    });
  }
};

module.exports = {
  markAttendance,
  bulkMarkAttendance,
  getStudentAttendance,
  getClassAttendanceReport,
  getDailyAttendanceSummary,
  updateAttendance,
  deleteAttendance
};