# 🎓 StudyHub - Backend API

A professional REST API backend for managing home tuition centers (Nursery to 10th grade students). Built with Node.js, Express, and MySQL.

## Features

- **Authentication & User Management** - JWT-based auth for Admin, Students, and Parents
- **Attendance Tracking** - Daily attendance with bulk marking support
- **Lesson (Sabaq) Tracking** - Track current lesson progress for each student
- **Test/Exam Management** - Weekly, monthly, and custom tests with results
- **Fee Management** - Fee structure, payments, pending fees, and reports
- **Progress Reports** - Student performance reports and report cards
- **Dashboard Statistics** - Overview of system metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator

## Project Structure

```
StudyHub/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection pool
│   ├── controllers/
│   │   ├── authController.js    # Authentication & user management
│   │   ├── attendanceController.js
│   │   ├── lessonController.js  # Lesson/Sabaq tracking
│   │   ├── testController.js    # Tests & exams
│   │   ├── feeController.js     # Fee management
│   │   └── reportController.js  # Reports & statistics
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   ├── migrate.js           # Migration runner
│   │   └── seed.js              # Database seeding
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Request validation
│   ├── routes/
│   │   └── index.js             # All API routes
│   └── server.js                # Express app setup
├── .env                          # Environment variables
└── package.json
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Steps

1. **Clone the repository**
   ```bash
   cd StudyHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Edit `.env` file with your database credentials:
   ```env
   PORT=3000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=study_hub
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   
   API_PREFIX=/api/v1
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   JWT_ISSUER=study_hub_app
   ```

4. **Create database**
   ```sql
   CREATE DATABASE study_hub;
   ```

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Seed initial data**
   ```bash
   npm run seed
   ```
   
   This creates:
   - Classes (Nursery to Class 10)
   - Subjects (Urdu, English, Math, Science, etc.)
   - Class-Subject mappings
   - Default admin user

7. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Default Credentials

After seeding, use these credentials to login:
- **Phone**: `03001234567`
- **Password**: `admin123`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/admin` | Register new admin |
| POST | `/api/v1/auth/register/student` | Register new student |
| POST | `/api/v1/auth/register/parent` | Register new parent |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/auth/profile` | Get user profile |
| PUT | `/api/v1/auth/profile` | Update profile |
| POST | `/api/v1/auth/change-password` | Change password |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/attendance` | Mark attendance |
| POST | `/api/v1/attendance/bulk` | Bulk mark attendance |
| GET | `/api/v1/attendance/student/:id` | Get student attendance |
| GET | `/api/v1/attendance/class/:id/report` | Class attendance report |
| GET | `/api/v1/attendance/daily/:date` | Daily summary |

### Lessons (Sabaq)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/lessons` | Create lesson |
| GET | `/api/v1/lessons/:id` | Get lesson |
| GET | `/api/v1/lessons/class-subject/:id` | Get class lessons |
| POST | `/api/v1/lesson-progress` | Update student progress |
| GET | `/api/v1/lesson-progress/student/:id` | Student progress |
| GET | `/api/v1/lesson-progress/current/:id` | Current lesson |

### Tests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tests` | Create test |
| GET | `/api/v1/tests/:id` | Get test |
| POST | `/api/v1/tests/:id/results` | Add result |
| POST | `/api/v1/tests/:id/results/bulk` | Bulk results |
| GET | `/api/v1/tests/student/:id/history` | Test history |
| GET | `/api/v1/tests/class/:id/upcoming` | Upcoming tests |

### Fees
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/fees/structure` | Create fee structure |
| POST | `/api/v1/fees/payment` | Record payment |
| GET | `/api/v1/fees/student/:id` | Student fee history |
| GET | `/api/v1/fees/class/:id/pending` | Pending fees |
| GET | `/api/v1/fees/defaulters` | Fee defaulters |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/reports/progress` | Create progress report |
| GET | `/api/v1/reports/student/:id/report-card` | Student report card |
| GET | `/api/v1/reports/dashboard` | Dashboard stats |

## API Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **admin** - Full access to all features (teacher)
- **student** - View own data, lessons, tests, attendance
- **parent** - View children's data and progress

## License

ISC