const { body, param, query, validationResult } = require('express-validator');

// Helper to format validation errors
const formatValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Common validators
const validators = {
  // ID validators
  idParam: param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
  uuidParam: param('uuid').isUUID().withMessage('Invalid UUID'),

  // User validators
  registerAdmin: [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required (10-15 digits)'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    formatValidationErrors
  ],

  registerStudent: [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('phone').matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('class_id').isInt({ min: 1 }).withMessage('Valid class ID is required'),
    body('date_of_birth').optional().isDate().withMessage('Invalid date of birth'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    formatValidationErrors
  ],

  registerParent: [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    formatValidationErrors
  ],

  login: [
    body('phone').matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
    formatValidationErrors
  ],

  updateProfile: [
    body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().matches(/^[0-9]{10,15}$/).withMessage('Valid phone number is required'),
    formatValidationErrors
  ],

  // Attendance validators
  markAttendance: [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('date').optional().isDate().withMessage('Invalid date format'),
    body('status').isIn(['present', 'absent', 'late', 'excused', 'half_day']).withMessage('Invalid attendance status'),
    body('remarks').optional().trim(),
    formatValidationErrors
  ],

  bulkAttendance: [
    body('date').isDate().withMessage('Invalid date format'),
    body('records').isArray({ min: 1 }).withMessage('At least one attendance record is required'),
    body('records.*.student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('records.*.status').isIn(['present', 'absent', 'late', 'excused', 'half_day']).withMessage('Invalid attendance status'),
    formatValidationErrors
  ],

  // Lesson validators
  createLesson: [
    body('class_subject_id').isInt({ min: 1 }).withMessage('Valid class subject ID is required'),
    body('title').trim().notEmpty().withMessage('Lesson title is required'),
    body('description').optional().trim(),
    body('chapter_number').optional().isInt({ min: 1 }).withMessage('Invalid chapter number'),
    body('chapter_name').optional().trim(),
    body('lesson_order').optional().isInt({ min: 1 }).withMessage('Invalid lesson order'),
    formatValidationErrors
  ],

  updateLessonProgress: [
    body('lesson_id').isInt({ min: 1 }).withMessage('Valid lesson ID is required'),
    body('status').isIn(['not_started', 'in_progress', 'completed', 'revised']).withMessage('Invalid status'),
    body('mastery_level').optional().isIn(['beginner', 'learning', 'proficient', 'mastered']).withMessage('Invalid mastery level'),
    body('notes').optional().trim(),
    formatValidationErrors
  ],

  // Test validators
  createTest: [
    body('title').trim().notEmpty().withMessage('Test title is required'),
    body('test_type').isIn(['weekly', 'monthly', 'quarterly', 'half_yearly', 'annual', 'surprise']).withMessage('Invalid test type'),
    body('class_subject_id').isInt({ min: 1 }).withMessage('Valid class subject ID is required'),
    body('total_marks').isInt({ min: 1 }).withMessage('Total marks must be positive'),
    body('passing_marks').optional().isInt({ min: 0 }).withMessage('Invalid passing marks'),
    body('duration_minutes').optional().isInt({ min: 1 }).withMessage('Invalid duration'),
    body('scheduled_date').isDate().withMessage('Invalid scheduled date'),
    body('description').optional().trim(),
    formatValidationErrors
  ],

  addTestResult: [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('obtained_marks').isFloat({ min: 0 }).withMessage('Obtained marks must be non-negative'),
    body('grade').optional().trim(),
    body('remarks').optional().trim(),
    formatValidationErrors
  ],

  // Fee validators
  createFeeStructure: [
    body('class_id').isInt({ min: 1 }).withMessage('Valid class ID is required'),
    body('fee_type').isIn(['tuition', 'admission', 'exam', 'transport', 'other']).withMessage('Invalid fee type'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative'),
    body('frequency').isIn(['monthly', 'quarterly', 'annual', 'one_time']).withMessage('Invalid frequency'),
    body('effective_from').isDate().withMessage('Invalid effective date'),
    body('effective_to').optional().isDate().withMessage('Invalid end date'),
    formatValidationErrors
  ],

  recordFeePayment: [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative'),
    body('payment_date').optional().isDate().withMessage('Invalid payment date'),
    body('payment_method').isIn(['cash', 'card', 'bank_transfer', 'online', 'cheque']).withMessage('Invalid payment method'),
    body('for_month').optional().isDate().withMessage('Invalid month'),
    body('for_year').optional().isInt({ min: 2020, max: 2100 }).withMessage('Invalid year'),
    formatValidationErrors
  ],

  // Progress report validators
  createProgressReport: [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('report_type').isIn(['weekly', 'monthly', 'quarterly', 'term']).withMessage('Invalid report type'),
    body('academic_period').trim().notEmpty().withMessage('Academic period is required'),
    body('overall_grade').optional().trim(),
    body('behavior_rating').optional().isIn(['excellent', 'good', 'average', 'needs_improvement']),
    body('participation_rating').optional().isIn(['excellent', 'good', 'average', 'needs_improvement']),
    formatValidationErrors
  ],

  // Pagination validators
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    formatValidationErrors
  ],

  // Date range validators
  dateRange: [
    query('start_date').optional().isDate().withMessage('Invalid start date'),
    query('end_date').optional().isDate().withMessage('Invalid end date'),
    formatValidationErrors
  ]
};

module.exports = validators;