require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

const pool = require('./db');
const academyRoutes = require('../routes/api/academyRoutes');
const authRoutes = require('../routes/api/authRoutes');
const userRoutes = require('../routes/api/userRoutes');
const classRoutes = require('../routes/api/classRoutes');
const profileRoutes = require('../routes/api/profileRoutes');
const attendanceRoutes = require('../routes/api/attendanceRoutes');
const homeworkRoutes = require('../routes/api/homeworkRoutes');
const lessonRoutes = require('../routes/api/lessonRoutes');
const examRoutes = require('../routes/api/examRoutes');
const feeRoutes = require('../routes/api/feeRoutes');
const salaryRoutes = require('../routes/api/salaryRoutes');
const notificationRoutes = require('../routes/api/notificationRoutes');
const reportRoutes = require('../routes/api/reportRoutes');
const errorHandler = require('../middlewares/errorHandler');
const apiLimiter = require('../middlewares/rateLimiter');
const { bind } = require("../middlewares/auth");

// web routes
const authRoute = require('../routes/web/authRoutes');

const app = express();

app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, '../assets')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);

app.set("layout", "layouts/application");

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(apiLimiter);

// Api Routes
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/academies`, academyRoutes);
app.use(process.env.BASE_URL, reportRoutes);
app.use(process.env.BASE_URL, notificationRoutes);
app.use(process.env.BASE_URL, salaryRoutes);
app.use(process.env.BASE_URL, feeRoutes);
app.use(process.env.BASE_URL, classRoutes);
app.use(process.env.BASE_URL, profileRoutes);
app.use(process.env.BASE_URL, lessonRoutes);
app.use(process.env.BASE_URL, examRoutes);
app.use(`${process.env.BASE_URL}/users`, userRoutes);
app.use(`${process.env.BASE_URL}/attendance`, attendanceRoutes);
app.use(`${process.env.BASE_URL}/homework`, homeworkRoutes);

app.use(bind);

app.use((req, res, next) => {
    res.locals.title = req.path.split('/')[1] ? req.path.split('/')[1].charAt(0).toUpperCase() + req.path.split('/')[1].slice(1) : 'Home';
    res.locals.user = req.user || null;
    next();
});

app.use(authRoute);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
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

module.exports = app;