require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const pool = require('./config/db');
const academyRoutes = require('./routes/academyRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const profileRoutes = require('./routes/profileRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const examRoutes = require('./routes/examRoutes');
const feeRoutes = require('./routes/feeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middlewares/errorHandler');
const apiLimiter = require('./middlewares/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(apiLimiter);

// Routes
app.use(process.env.BASE_URL, reportRoutes);
app.use(process.env.BASE_URL, notificationRoutes);
app.use(process.env.BASE_URL, salaryRoutes);
app.use(process.env.BASE_URL, feeRoutes);
app.use(process.env.BASE_URL, classRoutes);
app.use(process.env.BASE_URL, profileRoutes);
app.use(process.env.BASE_URL, lessonRoutes);
app.use(process.env.BASE_URL, examRoutes);
app.use(`${process.env.BASE_URL}/academies`, academyRoutes);
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/users`, userRoutes);
app.use(`${process.env.BASE_URL}/attendance`, attendanceRoutes);
app.use(`${process.env.BASE_URL}/homework`, homeworkRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to StudyHub API' });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.status(200).json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

// Handle unhandled rejections
// process.on('unhandledRejection', (err) => {
//   console.error('UNHANDLED REJECTION! Shutting down...');
//   console.error(err);
//   process.exit(1);
// });