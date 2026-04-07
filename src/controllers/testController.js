const { pool } = require('../config/database');
const dayjs = require('dayjs');

// Create a new test
const createTest = async (req, res) => {
  try {
    const {
      title,
      test_type,
      class_subject_id,
      total_marks,
      passing_marks,
      duration_minutes,
      scheduled_date,
      description,
      syllabus_coverage
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO tests (title, test_type, class_subject_id, total_marks, passing_marks,
       duration_minutes, scheduled_date, description, syllabus_coverage) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, test_type, class_subject_id, total_marks, passing_marks,
       duration_minutes, scheduled_date, description, syllabus_coverage]
    );

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: {
        id: result.insertId,
        title,
        test_type,
        scheduled_date
      }
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test',
      error: error.message
    });
  }
};

// Get all tests for a class subject
const getTests = async (req, res) => {
  try {
    const { class_subject_id } = req.params;
    const { test_type, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT t.*, s.name as subject_name, c.name as class_name
      FROM tests t
      JOIN class_subjects cs ON t.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN classes c ON cs.class_id = c.id
      WHERE t.class_subject_id = ? AND t.is_active = TRUE
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM tests WHERE class_subject_id = ? AND is_active = TRUE';
    let values = [class_subject_id];
    let countValues = [class_subject_id];

    if (test_type) {
      query += ' AND t.test_type = ?';
      countQuery += ' AND test_type = ?';
      values.push(test_type);
      countValues.push(test_type);
    }

    query += ' ORDER BY t.scheduled_date DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [tests] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tests',
      error: error.message
    });
  }
};

// Get a single test
const getTest = async (req, res) => {
  try {
    const { id } = req.params;

    const [tests] = await pool.execute(
      `SELECT t.*, s.name as subject_name, c.name as class_name
       FROM tests t
       JOIN class_subjects cs ON t.class_subject_id = cs.id
       JOIN subjects s ON cs.subject_id = s.id
       JOIN classes c ON cs.class_id = c.id
       WHERE t.id = ? AND t.is_active = TRUE`,
      [id]
    );

    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: tests[0]
    });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test',
      error: error.message
    });
  }
};

// Update a test
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      test_type,
      total_marks,
      passing_marks,
      duration_minutes,
      scheduled_date,
      description,
      syllabus_coverage
    } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (test_type !== undefined) {
      updates.push('test_type = ?');
      values.push(test_type);
    }
    if (total_marks !== undefined) {
      updates.push('total_marks = ?');
      values.push(total_marks);
    }
    if (passing_marks !== undefined) {
      updates.push('passing_marks = ?');
      values.push(passing_marks);
    }
    if (duration_minutes !== undefined) {
      updates.push('duration_minutes = ?');
      values.push(duration_minutes);
    }
    if (scheduled_date !== undefined) {
      updates.push('scheduled_date = ?');
      values.push(scheduled_date);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (syllabus_coverage !== undefined) {
      updates.push('syllabus_coverage = ?');
      values.push(syllabus_coverage);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE tests SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test updated successfully'
    });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update test',
      error: error.message
    });
  }
};

// Delete a test (soft delete)
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE tests SET is_active = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete test',
      error: error.message
    });
  }
};

// Add test result for a student
const addTestResult = async (req, res) => {
  try {
    const { test_id } = req.params;
    const { student_id, obtained_marks, grade, remarks } = req.body;

    // Check if test exists
    const [tests] = await pool.execute(
      'SELECT id, total_marks FROM tests WHERE id = ? AND is_active = TRUE',
      [test_id]
    );

    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    const totalMarks = tests[0].total_marks;

    // Validate obtained marks
    if (obtained_marks > totalMarks) {
      return res.status(400).json({
        success: false,
        message: `Obtained marks cannot exceed total marks (${totalMarks})`
      });
    }

    // Check if result already exists
    const [existing] = await pool.execute(
      'SELECT id FROM test_results WHERE test_id = ? AND student_id = ?',
      [test_id, student_id]
    );

    if (existing.length > 0) {
      // Update existing result
      await pool.execute(
        'UPDATE test_results SET obtained_marks = ?, grade = ?, remarks = ? WHERE id = ?',
        [obtained_marks, grade, remarks, existing[0].id]
      );

      return res.json({
        success: true,
        message: 'Test result updated successfully',
        data: { test_id, student_id, obtained_marks, grade }
      });
    }

    // Insert new result
    await pool.execute(
      'INSERT INTO test_results (test_id, student_id, obtained_marks, grade, remarks) VALUES (?, ?, ?, ?, ?)',
      [test_id, student_id, obtained_marks, grade, remarks]
    );

    res.status(201).json({
      success: true,
      message: 'Test result added successfully',
      data: { test_id, student_id, obtained_marks, grade }
    });
  } catch (error) {
    console.error('Add test result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add test result',
      error: error.message
    });
  }
};

// Add test results for multiple students (bulk)
const addBulkTestResults = async (req, res) => {
  try {
    const { test_id } = req.params;
    const { results } = req.body;

    // Check if test exists
    const [tests] = await pool.execute(
      'SELECT id, total_marks FROM tests WHERE id = ? AND is_active = TRUE',
      [test_id]
    );

    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    const totalMarks = tests[0].total_marks;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const processed = [];
      for (const result of results) {
        const { student_id, obtained_marks, grade, remarks } = result;

        // Validate obtained marks
        if (obtained_marks > totalMarks) {
          processed.push({ student_id, success: false, message: 'Marks exceed total' });
          continue;
        }

        // Check if result exists
        const [existing] = await connection.execute(
          'SELECT id FROM test_results WHERE test_id = ? AND student_id = ?',
          [test_id, student_id]
        );

        if (existing.length > 0) {
          await connection.execute(
            'UPDATE test_results SET obtained_marks = ?, grade = ?, remarks = ? WHERE id = ?',
            [obtained_marks, grade, remarks, existing[0].id]
          );
        } else {
          await connection.execute(
            'INSERT INTO test_results (test_id, student_id, obtained_marks, grade, remarks) VALUES (?, ?, ?, ?, ?)',
            [test_id, student_id, obtained_marks, grade, remarks]
          );
        }

        processed.push({ student_id, success: true });
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Test results processed successfully',
        data: { test_id, processed }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Add bulk test results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add test results',
      error: error.message
    });
  }
};

// Get test results for a test
const getTestResults = async (req, res) => {
  try {
    const { test_id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        tr.*,
        u.full_name as student_name,
        u.phone as student_phone,
        sp.roll_number,
        t.total_marks,
        ROUND((tr.obtained_marks * 100) / t.total_marks, 2) as percentage
      FROM test_results tr
      JOIN student_profiles sp ON tr.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN tests t ON tr.test_id = t.id
      WHERE tr.test_id = ? AND sp.is_active = TRUE
      ORDER BY tr.obtained_marks DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = 'SELECT COUNT(*) as total FROM test_results WHERE test_id = ?';

    const [results] = await pool.execute(query, [test_id, parseInt(limit), parseInt(offset)]);
    const [countResult] = await pool.execute(countQuery, [test_id]);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test results',
      error: error.message
    });
  }
};

// Get student's test history
const getStudentTestHistory = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { test_type, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        tr.*,
        t.title,
        t.test_type,
        t.total_marks,
        t.scheduled_date,
        s.name as subject_name,
        c.name as class_name,
        ROUND((tr.obtained_marks * 100) / t.total_marks, 2) as percentage
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      JOIN class_subjects cs ON t.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN classes c ON cs.class_id = c.id
      WHERE tr.student_id = ? AND t.is_active = TRUE
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      WHERE tr.student_id = ? AND t.is_active = TRUE
    `;
    let values = [student_id];
    let countValues = [student_id];

    if (test_type) {
      query += ' AND t.test_type = ?';
      countQuery += ' AND t.test_type = ?';
      values.push(test_type);
      countValues.push(test_type);
    }

    query += ' ORDER BY t.scheduled_date DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [tests] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get student test history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test history',
      error: error.message
    });
  }
};

// Get test statistics
const getTestStatistics = async (req, res) => {
  try {
    const { test_id } = req.params;

    const query = `
      SELECT 
        COUNT(*) as total_students,
        AVG(tr.obtained_marks) as average_marks,
        MIN(tr.obtained_marks) as lowest_marks,
        MAX(tr.obtained_marks) as highest_marks,
        ROUND(AVG((tr.obtained_marks * 100) / t.total_marks), 2) as average_percentage,
        SUM(CASE WHEN tr.obtained_marks >= t.passing_marks THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN tr.obtained_marks < t.passing_marks THEN 1 ELSE 0 END) as failed
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      WHERE tr.test_id = ?
    `;

    const [stats] = await pool.execute(query, [test_id]);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get test statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test statistics',
      error: error.message
    });
  }
};

// Get upcoming tests for a class
const getUpcomingTests = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { days = 30 } = req.query;

    const futureDate = dayjs().add(parseInt(days), 'day').format('YYYY-MM-DD');

    const query = `
      SELECT 
        t.*,
        s.name as subject_name,
        c.name as class_name
      FROM tests t
      JOIN class_subjects cs ON t.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.class_id = ? 
        AND t.scheduled_date >= CURDATE() 
        AND t.scheduled_date <= ?
        AND t.is_active = TRUE
      ORDER BY t.scheduled_date ASC
    `;

    const [tests] = await pool.execute(query, [class_id, futureDate]);

    res.json({
      success: true,
      data: {
        tests,
        count: tests.length
      }
    });
  } catch (error) {
    console.error('Get upcoming tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upcoming tests',
      error: error.message
    });
  }
};

module.exports = {
  createTest,
  getTests,
  getTest,
  updateTest,
  deleteTest,
  addTestResult,
  addBulkTestResults,
  getTestResults,
  getStudentTestHistory,
  getTestStatistics,
  getUpcomingTests
};