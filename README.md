# StudyHub - Backend API

A professional REST API backend for academic management. Built with Node.js, Express, and MySQL.

## Features

- **Authentication & User Management** - JWT-based auth for Admin, Students, and Parents
- **Attendance Tracking** - Daily attendance with bulk marking support
- **Lesson (Sabaq) Tracking** - Track current lesson progress for each student
- **Test/Exam Management** - Weekly, monthly, and custom tests with results
- **Fee Management** - Fee structure, payments, pending fees, and reports
- **Progress Reports** - Student performance reports and report cards
- **Dashboard Statistics** - Overview of system metrics

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
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=study_hub
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
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
   - Classes
   - Subjects
   - Class-Subject mappings
   - Default admin user

7. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```
   
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