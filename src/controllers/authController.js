const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { generateToken } = require('../middleware/auth');

// Register a new admin (teacher)
const registerAdmin = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    // Check if phone or email already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE phone = ? OR email = ?',
      [phone, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this phone number or email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const uuid = uuidv4();

    // Create admin user
    const [result] = await pool.execute(
      `INSERT INTO users (uuid, user_type, email, phone, password_hash, full_name, is_verified, is_active) 
       VALUES (?, 'admin', ?, ?, ?, ?, TRUE, TRUE)`,
      [uuid, email, phone, passwordHash, full_name]
    );

    const user = {
      id: result.insertId,
      uuid,
      userType: 'admin',
      email,
      phone,
      full_name
    };

    const token = generateToken({ userId: result.insertId });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register admin',
      error: error.message
    });
  }
};

// Register a new student
const registerStudent = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      password,
      class_id,
      date_of_birth,
      gender,
      address,
      city,
      state,
      emergency_contact,
      admission_number,
      parent_id
    } = req.body;

    // Check if phone already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Check if class exists
    const [classes] = await pool.execute(
      'SELECT id FROM classes WHERE id = ? AND is_active = TRUE',
      [class_id]
    );

    if (classes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class selected'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const uuid = uuidv4();

    // Start transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create user
      const [userResult] = await connection.execute(
        `INSERT INTO users (uuid, user_type, phone, password_hash, full_name, is_verified, is_active) 
         VALUES (?, 'student', ?, ?, ?, FALSE, TRUE)`,
        [uuid, phone, passwordHash, full_name]
      );

      const userId = userResult.insertId;

      // Create student profile
      await connection.execute(
        `INSERT INTO student_profiles (user_id, class_id, parent_id, date_of_birth, gender, 
         address, city, state, emergency_contact, admission_number, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [userId, class_id, parent_id || null, date_of_birth || null, gender || null,
         address || null, city || null, state || null, emergency_contact || null, admission_number || null]
      );

      // Link parent if parent_id provided
      if (parent_id) {
        await connection.execute(
          'INSERT INTO parent_student (parent_id, student_id, is_primary) VALUES (?, ?, TRUE)',
          [parent_id, userId]
        );
      }

      await connection.commit();

      const user = {
        id: userId,
        uuid,
        userType: 'student',
        phone,
        full_name,
        class_id
      };

      const token = generateToken({ userId });

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: { user, token }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register student',
      error: error.message
    });
  }
};

// Register a new parent
const registerParent = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    // Check if phone or email already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE phone = ? OR email = ?',
      [phone, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this phone number or email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const uuid = uuidv4();

    const [result] = await pool.execute(
      `INSERT INTO users (uuid, user_type, email, phone, password_hash, full_name, is_verified, is_active) 
       VALUES (?, 'parent', ?, ?, ?, ?, FALSE, TRUE)`,
      [uuid, email, phone, passwordHash, full_name]
    );

    const user = {
      id: result.insertId,
      uuid,
      userType: 'parent',
      email,
      phone,
      full_name
    };

    const token = generateToken({ userId: result.insertId });

    res.status(201).json({
      success: true,
      message: 'Parent registered successfully',
      data: { user, token }
    });
  } catch (error) {
    console.error('Register parent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register parent',
      error: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user by phone
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE phone = ? AND is_active = TRUE',
      [phone]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    const token = generateToken({ userId: user.id });

    const userData = {
      id: user.id,
      uuid: user.uuid,
      userType: user.user_type,
      email: user.email,
      phone: user.phone,
      fullName: user.full_name,
      isVerified: user.is_verified
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      'SELECT id, uuid, user_type, email, phone, full_name, profile_image, is_verified, created_at, last_login FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    let additionalData = null;

    // Get additional data based on user type
    if (user.user_type === 'student') {
      const [profiles] = await pool.execute(
        `SELECT sp.*, c.name as class_name, c.display_name as class_display_name 
         FROM student_profiles sp 
         JOIN classes c ON sp.class_id = c.id 
         WHERE sp.user_id = ?`,
        [userId]
      );
      additionalData = profiles[0] || null;
    }

    res.json({
      success: true,
      data: {
        user,
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email, phone, profile_image } = req.body;

    const updates = [];
    const values = [];

    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (profile_image) {
      updates.push('profile_image = ?');
      values.push(profile_image);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // Get current user
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(current_password, users[0].password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(new_password, 12);

    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newHash, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  registerStudent,
  registerParent,
  login,
  getProfile,
  updateProfile,
  changePassword
};