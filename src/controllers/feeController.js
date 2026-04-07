const { pool } = require('../config/database');
const dayjs = require('dayjs');

// Create fee structure
const createFeeStructure = async (req, res) => {
  try {
    const {
      class_id,
      fee_type,
      amount,
      frequency,
      description,
      effective_from,
      effective_to
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO fee_structure (class_id, fee_type, amount, frequency, description, 
       effective_from, effective_to) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [class_id, fee_type, amount, frequency, description, effective_from, effective_to]
    );

    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully',
      data: {
        id: result.insertId,
        class_id,
        fee_type,
        amount,
        frequency
      }
    });
  } catch (error) {
    console.error('Create fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create fee structure',
      error: error.message
    });
  }
};

// Get fee structures for a class
const getFeeStructures = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { fee_type, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT fs.*, c.name as class_name
      FROM fee_structure fs
      JOIN classes c ON fs.class_id = c.id
      WHERE fs.class_id = ? AND fs.is_active = TRUE
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM fee_structure WHERE class_id = ? AND is_active = TRUE';
    let values = [class_id];
    let countValues = [class_id];

    if (fee_type) {
      query += ' AND fs.fee_type = ?';
      countQuery += ' AND fee_type = ?';
      values.push(fee_type);
      countValues.push(fee_type);
    }

    query += ' ORDER BY fs.effective_from DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [structures] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        structures,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get fee structures error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fee structures',
      error: error.message
    });
  }
};

// Update fee structure
const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, frequency, description, effective_to } = req.body;

    const updates = [];
    const values = [];

    if (amount !== undefined) {
      updates.push('amount = ?');
      values.push(amount);
    }
    if (frequency !== undefined) {
      updates.push('frequency = ?');
      values.push(frequency);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (effective_to !== undefined) {
      updates.push('effective_to = ?');
      values.push(effective_to);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE fee_structure SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    res.json({
      success: true,
      message: 'Fee structure updated successfully'
    });
  } catch (error) {
    console.error('Update fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update fee structure',
      error: error.message
    });
  }
};

// Delete fee structure (soft delete)
const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE fee_structure SET is_active = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    res.json({
      success: true,
      message: 'Fee structure deleted successfully'
    });
  } catch (error) {
    console.error('Delete fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete fee structure',
      error: error.message
    });
  }
};

// Record fee payment
const recordFeePayment = async (req, res) => {
  try {
    const {
      student_id,
      amount,
      payment_date,
      payment_method,
      transaction_id,
      for_month,
      for_year,
      late_fee,
      discount,
      remarks
    } = req.body;

    const paidBy = req.user.id;
    const paymentDate = payment_date || dayjs().format('YYYY-MM-DD');

    // Generate receipt number
    const receiptNumber = `REC-${dayjs().format('YYYYMMDD')}-${student_id}-${Date.now().toString().slice(-4)}`;

    const [result] = await pool.execute(
      `INSERT INTO fee_payments (student_id, amount, payment_date, payment_method, 
       transaction_id, status, for_month, for_year, late_fee, discount, remarks, 
       receipt_number, paid_by) 
       VALUES (?, ?, ?, ?, ?, 'paid', ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, amount, paymentDate, payment_method, transaction_id,
       for_month, for_year, late_fee || 0, discount || 0, remarks, receiptNumber, paidBy]
    );

    res.status(201).json({
      success: true,
      message: 'Fee payment recorded successfully',
      data: {
        id: result.insertId,
        receipt_number: receiptNumber,
        student_id,
        amount,
        payment_date: paymentDate
      }
    });
  } catch (error) {
    console.error('Record fee payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record fee payment',
      error: error.message
    });
  }
};

// Get fee payments for a student
const getStudentFeePayments = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { for_year, page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        fp.*,
        u.full_name as student_name,
        u.phone as student_phone,
        sp.roll_number,
        c.name as class_name,
        payer.full_name as paid_by_name
      FROM fee_payments fp
      JOIN student_profiles sp ON fp.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN classes c ON sp.class_id = c.id
      LEFT JOIN users payer ON fp.paid_by = payer.id
      WHERE fp.student_id = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM fee_payments WHERE student_id = ?';
    let values = [student_id];
    let countValues = [student_id];

    if (for_year) {
      query += ' AND fp.for_year = ?';
      countQuery += ' AND for_year = ?';
      values.push(for_year);
      countValues.push(for_year);
    }

    query += ' ORDER BY fp.payment_date DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit), parseInt(offset));

    const [payments] = await pool.execute(query, values);
    const [countResult] = await pool.execute(countQuery, countValues);

    const total = countResult[0].total;

    // Get fee summary
    const [summary] = await pool.execute(
      `SELECT 
        SUM(amount) as total_paid,
        SUM(late_fee) as total_late_fee,
        SUM(discount) as total_discount,
        COUNT(*) as total_payments
       FROM fee_payments 
       WHERE student_id = ?`,
      [student_id]
    );

    res.json({
      success: true,
      data: {
        payments,
        summary: summary[0],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get student fee payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fee payments',
      error: error.message
    });
  }
};

// Get pending/overdue fees for a class
const getPendingFees = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { for_year } = req.query;

    // Get all students in the class
    const [students] = await pool.execute(
      'SELECT sp.id, u.full_name, u.phone, sp.roll_number FROM student_profiles sp JOIN users u ON sp.user_id = u.id WHERE sp.class_id = ? AND sp.is_active = TRUE',
      [class_id]
    );

    // Get fee structure for the class
    const [feeStructures] = await pool.execute(
      `SELECT * FROM fee_structure 
       WHERE class_id = ? AND fee_type = 'tuition' AND is_active = TRUE 
       AND effective_from <= CURDATE() 
       AND (effective_to IS NULL OR effective_to >= CURDATE())
       ORDER BY effective_from DESC LIMIT 1`,
      [class_id]
    );

    const monthlyFee = feeStructures.length > 0 ? feeStructures[0].amount : 0;
    const currentYear = for_year || dayjs().year();

    const pendingFees = [];

    for (const student of students) {
      // Get paid months for this student
      const [paidMonths] = await pool.execute(
        `SELECT MONTH(for_month) as month, YEAR(for_month) as year, SUM(amount) as paid_amount 
         FROM fee_payments 
         WHERE student_id = ? AND YEAR(for_year) = ? AND status = 'paid'
         GROUP BY MONTH(for_month), YEAR(for_month)`,
        [student.id, currentYear]
      );

      const paidMonthsSet = new Set(paidMonths.map(p => p.month));
      const totalPaid = paidMonths.reduce((sum, p) => sum + parseFloat(p.paid_amount), 0);

      // Calculate expected months (up to current month)
      const currentMonth = dayjs().month() + 1;
      const expectedMonths = currentMonth;
      const expectedAmount = monthlyFee * expectedMonths;
      const pendingAmount = expectedAmount - totalPaid;

      if (pendingAmount > 0) {
        const unpaidMonths = [];
        for (let m = 1; m <= currentMonth; m++) {
          if (!paidMonthsSet.has(m)) {
            unpaidMonths.push(m);
          }
        }

        pendingFees.push({
          student_id: student.id,
          student_name: student.full_name,
          phone: student.phone,
          roll_number: student.roll_number,
          monthly_fee: monthlyFee,
          expected_months: expectedMonths,
          paid_months: paidMonths.length,
          unpaid_months: unpaidMonths,
          total_paid: totalPaid,
          expected_amount: expectedAmount,
          pending_amount: pendingAmount
        });
      }
    }

    res.json({
      success: true,
      data: {
        class_id: parseInt(class_id),
        year: currentYear,
        monthly_fee: monthlyFee,
        students_with_pending: pendingFees.length,
        total_pending_amount: pendingFees.reduce((sum, f) => sum + f.pending_amount, 0),
        pending_fees: pendingFees
      }
    });
  } catch (error) {
    console.error('Get pending fees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending fees',
      error: error.message
    });
  }
};

// Get fee collection report
const getFeeCollectionReport = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { start_date, end_date, for_year } = req.query;

    let query = `
      SELECT 
        fp.payment_method,
        COUNT(*) as transaction_count,
        SUM(fp.amount) as total_amount,
        SUM(fp.late_fee) as total_late_fee,
        SUM(fp.discount) as total_discount
      FROM fee_payments fp
      JOIN student_profiles sp ON fp.student_id = sp.id
      WHERE fp.status = 'paid'
    `;

    let values = [];

    if (class_id) {
      query += ' AND sp.class_id = ?';
      values.push(class_id);
    }

    if (start_date) {
      query += ' AND fp.payment_date >= ?';
      values.push(start_date);
    }

    if (end_date) {
      query += ' AND fp.payment_date <= ?';
      values.push(end_date);
    }

    if (for_year) {
      query += ' AND YEAR(fp.for_year) = ?';
      values.push(for_year);
    }

    query += ' GROUP BY fp.payment_method';

    const [report] = await pool.execute(query, values);

    // Get total summary
    const totalQuery = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as grand_total,
        SUM(late_fee) as total_late_fee,
        SUM(discount) as total_discount
      FROM fee_payments fp
      JOIN student_profiles sp ON fp.student_id = sp.id
      WHERE fp.status = 'paid'
    `;

    const [totalSummary] = await pool.execute(totalQuery, values);

    res.json({
      success: true,
      data: {
        date_range: { start_date, end_date },
        for_year: for_year,
        by_payment_method: report,
        total: totalSummary[0]
      }
    });
  } catch (error) {
    console.error('Get fee collection report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fee collection report',
      error: error.message
    });
  }
};

// Get fee defaulters
const getFeeDefaulters = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { days_overdue = 30 } = req.query;

    const query = `
      SELECT 
        sp.id as student_id,
        u.full_name as student_name,
        u.phone,
        sp.roll_number,
        c.name as class_name,
        COUNT(fp.id) as unpaid_count,
        SUM(fp.amount) as total_unpaid
      FROM fee_payments fp
      JOIN student_profiles sp ON fp.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN classes c ON sp.class_id = c.id
      WHERE fp.status IN ('pending', 'overdue')
        AND fp.due_date < DATE_SUB(CURDATE(), INTERVAL ? DAY)
        ${class_id ? 'AND sp.class_id = ?' : ''}
      GROUP BY sp.id, u.full_name, u.phone, sp.roll_number, c.name
      ORDER BY total_unpaid DESC
    `;

    const values = class_id ? [parseInt(days_overdue), class_id] : [parseInt(days_overdue)];

    const [defaulters] = await pool.execute(query, values);

    res.json({
      success: true,
      data: {
        count: defaulters.length,
        defaulters
      }
    });
  } catch (error) {
    console.error('Get fee defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fee defaulters',
      error: error.message
    });
  }
};

// Update fee payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const [result] = await pool.execute(
      'UPDATE fee_payments SET status = ?, remarks = ? WHERE id = ?',
      [status, remarks, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

module.exports = {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  recordFeePayment,
  getStudentFeePayments,
  getPendingFees,
  getFeeCollectionReport,
  getFeeDefaulters,
  updatePaymentStatus
};