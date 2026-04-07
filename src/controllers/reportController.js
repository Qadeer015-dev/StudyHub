
const { pool } = require('../config/database');
const dayjs = require('dayjs');

// Create progress report for a student
const createProgressReport = async (req, res) => {
  try {
    const {
      student_id,
      report_type,
      academic_period,
      overall_grade,
      attendance_percentage,
      behavior_rating,
      participation_rating,
      strengths,
      weaknesses,
      teacher_comments,
      recommendations
    } = req.body;

    const teacherId = req.user.id;

    const [result] = await pool.execute(
      `INSERT INTO progress_reports (student_id, teacher_id, report_type, academic_period,
       overall_grade, attendance_percentage, behavior_rating, participation_rating,
       strengths, weaknesses, teacher_comments, recommendations) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, teacherId, report_type, academic_period, overall_grade,
       attendance_percentage, behavior_rating, participation_rating,
       strengths, weaknesses, teacher_comments, recommendations]
    );

    res.status(201).json({
      success: true,
      message: 'Progress report created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create progress report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create progress report',
      error: error.message
    });
  }
};

// Get progress reports for a student
const getStudentProgressReports = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { report_type, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT pr.*, u.full_name as student_name, t.full_name as teacher_name
      FROM progress_reports pr
      JOIN student_profiles sp ON pr.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN users t ON pr.teacher_id = t.id
      WHERE pr.student_id = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM progress_reports WHERE student_id = ?';
    let values = [student_id];
    let countValues = [student_id];

    if (report_type) {
      query += ' AND pr.report_type = ?';
      countQuery += ' AND report_type = ?';
      values.push(report_type);
      countValues.push(report_type);
    }

    query += ' ORDER BY pr.created_at DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [reports] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get student progress reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress reports',
      error: error.message
    });
  }
};

// Update progress report
const updateProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      overall_grade,
      attendance_percentage,
      behavior_rating,
      participation_rating,
      strengths,
      weaknesses,
      teacher_comments,
      recommendations
    } = req.body;

    const updates = [];
    const values = [];

    if (overall_grade !== undefined) { updates.push('overall_grade = ?'); values.push(overall_grade); }
    if (attendance_percentage !== undefined) { updates.push('attendance_percentage = ?'); values.push(attendance_percentage); }
    if (behavior_rating !== undefined) { updates.push('behavior_rating = ?'); values.push(behavior_rating); }
    if (participation_rating !== undefined) { updates.push('participation_rating = ?'); values.push(participation_rating); }
    if (strengths !== undefined) { updates.push('strengths = ?'); values.push(strengths); }
    if (weaknesses !== undefined) { updates.push('weaknesses = ?'); values.push(weaknesses); }
    if (teacher_comments !== undefined) { updates.push('teacher_comments = ?'); values.push(teacher_comments); }
    if (recommendations !== undefined) { updates.push('recommendations = ?'); values.push(recommendations); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await pool.execute(`UPDATE progress_reports SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ success: true, message: 'Progress report updated successfully' });
  } catch (error) {
    console.error('Update progress report error:', error);
    res.status(500).json({ success: false, message: 'Failed to update progress report', error: error.message });
  }
};

// Parent acknowledge progress report
const acknowledgeProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { parent_comments } = req.body;

    const [result] = await pool.execute(
      'UPDATE progress_reports SET parent_acknowledged = TRUE, parent_comments = ? WHERE id = ?',
      [parent_comments, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Progress report not found' });
    }

    res.json({ success: true, message: 'Progress report acknowledged successfully' });
  } catch (error) {
    console.error('Acknowledge progress report error:', error);
    res.status(500).json({ success: false, message: 'Failed to acknowledge progress report', error: error.message });
  }
};

// Get comprehensive student report card
const getStudentReportCard = async (req, res) => {
  try {
    const { student_id } = req.params;

    const [students] = await pool.execute(
      `SELECT sp.*, u.full_name, u.email, u.phone, c.name as class_name, c.display_name as class_display_name
       FROM student_profiles sp
       JOIN users u ON sp.user_id = u.id
       JOIN classes c ON sp.class_id = c.id
       WHERE sp.id = ?`,
      [student_id]
    );

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = students[0];

    const [attendanceSummary] = await pool.execute(
      `SELECT COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
        ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance_percentage
       FROM attendance WHERE student_id = ?`,
      [student_id]
    );

    const [testSummary] = await pool.execute(
      `SELECT COUNT(*) as total_tests, AVG(obtained_marks) as average_marks,
        MIN(obtained_marks) as lowest_marks, MAX(obtained_marks) as highest_marks
       FROM test_results WHERE student_id = ?`,
      [student_id]
    );

    const [recentTests] = await pool.execute(
      `SELECT tr.*, t.title, t.test_type, t.total_marks, t.scheduled_date, s.name as subject_name
       FROM test_results tr
       JOIN tests t ON tr.test_id = t.id
       JOIN class_subjects cs ON t.class_subject_id = cs.id
       JOIN subjects s ON cs.subject_id = s.id
       WHERE tr.student_id = ?
       ORDER BY t.scheduled_date DESC LIMIT 10`,
      [student_id]
    );

    const [lessonProgress] = await pool.execute(
      `SELECT status, COUNT(*) as count FROM student_lesson_progress WHERE student_id = ? GROUP BY status`,
      [student_id]
    );

    const [progressReports] = await pool.execute(
      `SELECT * FROM progress_reports WHERE student_id = ? ORDER BY created_at DESC LIMIT 5`,
      [student_id]
    );

    res.json({
      success: true,
      data: {
        student,
        attendance: attendanceSummary[0],
        tests: { summary: testSummary[0], recent: recentTests },
        lesson_progress: lessonProgress,
        progress_reports: progressReports
      }
    });
  } catch (error) {
    console.error('Get student report card error:', error);
    res.status(500).json({ success: false, message: 'Failed to get report card', error: error.message });
  }
};

// Get dashboard statistics for admin
const getDashboardStats = async (req, res) => {
  try {
    // Total students
    const [studentsCount] = await pool.execute(
      'SELECT COUNT(*) as total FROM student_profiles WHERE is_active = TRUE'
    );

    // Total classes
    const [classesCount] = await pool.execute(
      'SELECT COUNT(*) as total FROM classes WHERE is_active = TRUE'
    );

    // Today's attendance
    const [todayAttendance] = await pool.execute(
      `SELECT status, COUNT(*) as count FROM attendance WHERE date = CURDATE() GROUP BY status`
    );

    // Pending fees
    const [pendingFees] = await pool.execute(
      `SELECT COUNT(*) as count, SUM(amount) as total_amount FROM fee_payments WHERE status IN ('pending', 'overdue')`
    );

    // Upcoming tests
    const [upcomingTests] = await pool.execute(
      `SELECT COUNT(*) as count FROM tests WHERE scheduled_date >= CURDATE() AND scheduled_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) AND is_active = TRUE`
    );

    res.json({
      success: true,
      data: {
        total_students: studentsCount[0].total,
        total_classes: classesCount[0].total,
        today_attendance: todayAttendance,
        pending_fees: pendingFees[0],
        upcoming_tests: upcomingTests[0]
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get dashboard stats', error: error.message });
  }
};

module.exports = {
  createProgressReport,
  getStudentProgressReports,
  updateProgressReport,
  acknowledgeProgressReport,
  getStudentReportCard,
  getDashboardStats
};