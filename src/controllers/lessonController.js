const { pool } = require('../config/database');

// Create a new lesson
const createLesson = async (req, res) => {
  try {
    const {
      class_subject_id,
      title,
      description,
      chapter_number,
      chapter_name,
      page_numbers,
      lesson_order,
      estimated_duration_minutes
    } = req.body;

    // Get the next lesson_order if not provided
    let order = lesson_order;
    if (!order) {
      const [maxOrder] = await pool.execute(
        'SELECT MAX(lesson_order) as max_order FROM lessons WHERE class_subject_id = ?',
        [class_subject_id]
      );
      order = (maxOrder[0].max_order || 0) + 1;
    }

    const [result] = await pool.execute(
      `INSERT INTO lessons (class_subject_id, title, description, chapter_number, 
       chapter_name, page_numbers, lesson_order, estimated_duration_minutes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [class_subject_id, title, description, chapter_number, chapter_name, 
       page_numbers, order, estimated_duration_minutes]
    );

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: {
        id: result.insertId,
        class_subject_id,
        title,
        lesson_order: order
      }
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson',
      error: error.message
    });
  }
};

// Get lessons for a class subject
const getLessons = async (req, res) => {
  try {
    const { class_subject_id } = req.params;
    const { page = 1, limit = 50, chapter } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT l.*, cs.class_id, cs.subject_id, s.name as subject_name, c.name as class_name
      FROM lessons l
      JOIN class_subjects cs ON l.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN classes c ON cs.class_id = c.id
      WHERE l.class_subject_id = ? AND l.is_active = TRUE
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM lessons WHERE class_subject_id = ? AND is_active = TRUE';
    let values = [class_subject_id];
    let countValues = [class_subject_id];

    if (chapter) {
      query += ' AND l.chapter_number = ?';
      countQuery += ' AND chapter_number = ?';
      values.push(chapter);
      countValues.push(chapter);
    }

    query += ' ORDER BY l.lesson_order ASC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [lessons] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        lessons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lessons',
      error: error.message
    });
  }
};

// Get a single lesson
const getLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const [lessons] = await pool.execute(
      `SELECT l.*, cs.class_id, cs.subject_id, s.name as subject_name, c.name as class_name
       FROM lessons l
       JOIN class_subjects cs ON l.class_subject_id = cs.id
       JOIN subjects s ON cs.subject_id = s.id
       JOIN classes c ON cs.class_id = c.id
       WHERE l.id = ? AND l.is_active = TRUE`,
      [id]
    );

    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lessons[0]
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lesson',
      error: error.message
    });
  }
};

// Update a lesson
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      chapter_number,
      chapter_name,
      page_numbers,
      lesson_order,
      estimated_duration_minutes
    } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (chapter_number !== undefined) {
      updates.push('chapter_number = ?');
      values.push(chapter_number);
    }
    if (chapter_name !== undefined) {
      updates.push('chapter_name = ?');
      values.push(chapter_name);
    }
    if (page_numbers !== undefined) {
      updates.push('page_numbers = ?');
      values.push(page_numbers);
    }
    if (lesson_order !== undefined) {
      updates.push('lesson_order = ?');
      values.push(lesson_order);
    }
    if (estimated_duration_minutes !== undefined) {
      updates.push('estimated_duration_minutes = ?');
      values.push(estimated_duration_minutes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE lessons SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson',
      error: error.message
    });
  }
};

// Delete a lesson (soft delete)
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE lessons SET is_active = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson',
      error: error.message
    });
  }
};

// Update student's lesson progress (current sabaq tracking)
const updateStudentLessonProgress = async (req, res) => {
  try {
    const { student_id, lesson_id, status, mastery_level, notes } = req.body;

    // Check if student exists
    const [students] = await pool.execute(
      'SELECT id FROM student_profiles WHERE id = ?',
      [student_id]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if lesson exists
    const [lessons] = await pool.execute(
      'SELECT id FROM lessons WHERE id = ?',
      [lesson_id]
    );

    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if progress record exists
    const [existing] = await pool.execute(
      'SELECT id FROM student_lesson_progress WHERE student_id = ? AND lesson_id = ?',
      [student_id, lesson_id]
    );

    if (existing.length > 0) {
      // Update existing progress
      const updates = [];
      const values = [];

      if (status) {
        updates.push('status = ?');
        values.push(status);
      }
      if (mastery_level) {
        updates.push('mastery_level = ?');
        values.push(mastery_level);
      }
      if (notes !== undefined) {
        updates.push('notes = ?');
        values.push(notes);
      }

      if (status === 'completed' || status === 'revised') {
        updates.push('completion_date = NOW()');
      }
      if (status === 'in_progress' && existing[0].start_date === null) {
        updates.push('start_date = NOW()');
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      values.push(existing[0].id);

      await pool.execute(
        `UPDATE student_lesson_progress SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      res.json({
        success: true,
        message: 'Lesson progress updated successfully'
      });
    } else {
      // Create new progress record
      const startDate = status === 'in_progress' ? new Date() : null;
      const completionDate = ['completed', 'revised'].includes(status) ? new Date() : null;

      await pool.execute(
        `INSERT INTO student_lesson_progress (student_id, lesson_id, status, mastery_level, 
         notes, start_date, completion_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [student_id, lesson_id, status, mastery_level || 'beginner', notes, startDate, completionDate]
      );

      res.status(201).json({
        success: true,
        message: 'Lesson progress created successfully'
      });
    }
  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson progress',
      error: error.message
    });
  }
};

// Get student's lesson progress
const getStudentLessonProgress = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { class_subject_id, status, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        slp.*,
        l.title,
        l.description,
        l.chapter_number,
        l.chapter_name,
        l.page_numbers,
        l.lesson_order,
        cs.class_id,
        cs.subject_id,
        s.name as subject_name,
        c.name as class_name
      FROM student_lesson_progress slp
      JOIN lessons l ON slp.lesson_id = l.id
      JOIN class_subjects cs ON l.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      JOIN classes c ON cs.class_id = c.id
      WHERE slp.student_id = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM student_lesson_progress WHERE student_id = ?';
    let values = [student_id];
    let countValues = [student_id];

    if (class_subject_id) {
      query += ' AND l.class_subject_id = ?';
      countQuery += ' AND lesson_id IN (SELECT id FROM lessons WHERE class_subject_id = ?)';
      values.push(class_subject_id);
      countValues.push(class_subject_id);
    }

    if (status) {
      query += ' AND slp.status = ?';
      countQuery += ' AND status = ?';
      values.push(status);
      countValues.push(status);
    }

    query += ' ORDER BY l.lesson_order ASC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [progress] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    // Get summary
    const [summary] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as count
       FROM student_lesson_progress 
       WHERE student_id = ? 
       GROUP BY status`,
      [student_id]
    );

    res.json({
      success: true,
      data: {
        progress,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get student lesson progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lesson progress',
      error: error.message
    });
  }
};

// Get current lesson (sabaq) for a student
const getCurrentLesson = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { class_subject_id } = req.query;

    let query = `
      SELECT 
        slp.*,
        l.title,
        l.description,
        l.chapter_number,
        l.chapter_name,
        l.page_numbers,
        l.lesson_order,
        cs.class_id,
        cs.subject_id,
        s.name as subject_name
      FROM student_lesson_progress slp
      JOIN lessons l ON slp.lesson_id = l.id
      JOIN class_subjects cs ON l.class_subject_id = cs.id
      JOIN subjects s ON cs.subject_id = s.id
      WHERE slp.student_id = ? AND slp.status IN ('in_progress', 'not_started')
    `;

    let values = [student_id];

    if (class_subject_id) {
      query += ' AND l.class_subject_id = ?';
      values.push(class_subject_id);
    }

    query += ' ORDER BY l.lesson_order ASC LIMIT 1';

    const [currentLesson] = await pool.execute(query, values);

    if (currentLesson.length === 0) {
      return res.json({
        success: true,
        message: 'No current lesson found. All lessons may be completed.',
        data: null
      });
    }

    res.json({
      success: true,
      data: currentLesson[0]
    });
  } catch (error) {
    console.error('Get current lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get current lesson',
      error: error.message
    });
  }
};

// Get lesson progress summary for a class
const getClassLessonProgressSummary = async (req, res) => {
  try {
    const { class_subject_id } = req.params;

    const query = `
      SELECT 
        slp.status,
        COUNT(*) as count
      FROM student_lesson_progress slp
      JOIN lessons l ON slp.lesson_id = l.id
      JOIN student_profiles sp ON slp.student_id = sp.id
      WHERE l.class_subject_id = ? AND sp.class_id = (
        SELECT class_id FROM class_subjects WHERE id = ?
      ) AND sp.is_active = TRUE
      GROUP BY slp.status
    `;

    const [summary] = await pool.execute(query, [class_subject_id, class_subject_id]);

    // Get total students in class
    const [totalResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM student_profiles 
       WHERE class_id = (SELECT class_id FROM class_subjects WHERE id = ?) AND is_active = TRUE`,
      [class_subject_id]
    );

    res.json({
      success: true,
      data: {
        class_subject_id: parseInt(class_subject_id),
        total_students: totalResult[0].total,
        progress_summary: summary
      }
    });
  } catch (error) {
    console.error('Get class lesson progress summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress summary',
      error: error.message
    });
  }
};

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  updateStudentLessonProgress,
  getStudentLessonProgress,
  getCurrentLesson,
  getClassLessonProgressSummary
};