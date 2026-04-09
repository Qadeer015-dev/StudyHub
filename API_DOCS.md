# StudyHub API Documentation

> **Base URL:** `http://localhost:5000/api/v1`

All endpoints (except `/auth/register` and `/auth/login`) require authentication via a Bearer token in the `Authorization` header.

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Academy Management](#1-academy-management)
2. [Authentication & User Management](#2-authentication--user-management)
3. [Class Grades & Subjects](#3-class-grades--subjects)
4. [Student & Parent Profiles](#4-student--parent-profiles)
5. [Attendance](#5-attendance)
6. [Homework](#6-homework)
7. [Lessons & Progress](#7-lessons--progress)
8. [Exams & Test Results](#8-exams--test-results)
9. [Fee Management](#9-fee-management)
10. [Teacher Salary Management](#10-teacher-salary-management)
11. [Notifications](#11-notifications)
12. [PDF Reports](#12-pdf-reports)
13. [Error Codes](#error-codes)
14. [Rate Limiting](#rate-limiting)

---

## Response Formats

### ✅ Success Response

```json
{
  "success": true,
  "data": { } ,
  "message": "Operation successful"
}
```

### ❌ Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 1. Academy Management

### 1.1 Create Academy

| | |
|---|---|
| **Endpoint** | `POST /academies` |
| **Access** | Public |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Academy name |
| `email` | string | ✅ | Unique email |
| `owner_name` | string | ✅ | Owner's full name |
| `phone` | string | ❌ | 7–20 chars; allowed: digits, spaces, `-`, `(`, `)`, `.` |
| `registration_number` | string | ❌ | |
| `address` | string | ❌ | |
| `city` | string | ❌ | |
| `state` | string | ❌ | |
| `country` | string | ❌ | |
| `postal_code` | string | ❌ | |
| `owner_phone` | string | ❌ | |
| `owner_email` | string | ❌ | |
| `establishment_date` | date | ❌ | Format: `YYYY-MM-DD` |
| `website` | string | ❌ | Valid URL |
| `description` | text | ❌ | |

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Academy created successfully",
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### 1.2 Get All Academies

| | |
|---|---|
| **Endpoint** | `GET /academies` |
| **Access** | Public |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `status` | string | Filter by status: `active`, `inactive`, `suspended` |

**Success Response** `200 OK`

```json
{
  "success": true,
  "count": 2,
  "data": [ ]
}
```

---

### 1.3 Get Academy by ID or UUID

| | |
|---|---|
| **Endpoint** | `GET /academies/:id` |
| **Access** | Public |

**URL Parameter:** `id` — Numeric ID or UUID string

**Success Response** `200 OK` — Single academy object

---

### 1.4 Update Academy

| | |
|---|---|
| **Endpoint** | `PATCH /academies/:id` |
| **Access** | Public *(should be restricted to academy admin in production)* |

**URL Parameter:** `id` — Numeric ID

**Request Body:** Any academy fields except `id`, `uuid`, `created_at`

**Success Response** `200 OK`

---

### 1.5 Delete Academy *(Soft Delete)*

| | |
|---|---|
| **Endpoint** | `DELETE /academies/:id` |
| **Access** | Public *(should be restricted in production)* |

**Success Response** `200 OK`

---

## 2. Authentication & User Management

### 2.1 Register User

| | |
|---|---|
| **Endpoint** | `POST /auth/register` |
| **Access** | Public |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | Valid email address |
| `password` | string | ✅ | Minimum 6 characters |
| `full_name` | string | ✅ | |
| `phone` | string | ❌ | Valid phone format |
| `role` | string | ✅ | `admin`, `teacher`, `student`, `parent` |
| `academy_id` | integer | ❌ | Required for non-admin roles |

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "uuid": "...",
      "email": "...",
      "full_name": "...",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2.2 Login

| | |
|---|---|
| **Endpoint** | `POST /auth/login` |
| **Access** | Public |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | |
| `password` | string | ✅ | |
| `academy_id` | integer | ❌ | For context-specific login |

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { },
    "token": "..."
  }
}
```

---

### 2.3 Get Current User Profile

| | |
|---|---|
| **Endpoint** | `GET /auth/profile` |
| **Access** | Authenticated (any role) |

**Success Response** `200 OK` — User object including roles

---

### 2.4 Change Password

| | |
|---|---|
| **Endpoint** | `POST /auth/change-password` |
| **Access** | Authenticated |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `current_password` | string | ✅ | |
| `new_password` | string | ✅ | Minimum 6 characters |

**Success Response** `200 OK`

---

### 2.5 Get All Users

| | |
|---|---|
| **Endpoint** | `GET /users` |
| **Access** | `admin` only |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `academy_id` | integer | Filter by academy |

---

### 2.6 Update User

| | |
|---|---|
| **Endpoint** | `PATCH /users/:id` |
| **Access** | `admin` (any user) or self (limited fields) |

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `email` | string | ✅ |
| `full_name` | string | ❌ |
| `phone` | string | ❌ |
| `date_of_birth` | string | ❌ |
| `gender` | string | ❌ |
| `is_active` | boolean | ❌ |

**Success Response** `200 OK`

---

### 2.7 Delete User

| | |
|---|---|
| **Endpoint** | `DELETE /users/:id` |
| **Access** | `admin` only |

> **Note:** Cannot delete self.

**Success Response** `200 OK`

---

### 2.8 Assign Role to User

| | |
|---|---|
| **Endpoint** | `POST /users/:id/roles` |
| **Access** | `admin` only |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | ✅ | `admin`, `teacher`, `student`, `parent` |
| `academy_id` | integer | ❌ | |

**Success Response** `200 OK`

---

### 2.9 Revoke Role

| | |
|---|---|
| **Endpoint** | `DELETE /users/:id/roles` |
| **Access** | `admin` only |

**Request Body:** Same as [Assign Role](#28-assign-role-to-user)

**Success Response** `200 OK`

---

### 2.10 Reset User Password

| | |
|---|---|
| **Endpoint** | `POST /users/:id/reset-password` |
| **Access** | `admin` only |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `new_password` | string | ✅ | Minimum 6 characters |

**Success Response** `200 OK`

---

### 2.11 Update Own Profile

| | |
|---|---|
| **Endpoint** | `PATCH /users/profile` |
| **Access** | Authenticated |

**Request Body:** Allowed fields: `full_name`, `phone`, `address`, etc.

**Success Response** `200 OK`

---

## 3. Class Grades & Subjects

### 3.1 Class Grade Endpoints

#### Create Class Grade

| | |
|---|---|
| **Endpoint** | `POST /grades` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `academy_id` | integer | ✅ |
| `name` | string | ✅ |
| `display_name` | string | ✅ |
| `grade_level` | integer | ✅ |
| `description` | string | ❌ |

**Success Response** `201 Created`

---

#### Get All Class Grades

| | |
|---|---|
| **Endpoint** | `GET /grades` |
| **Access** | Authenticated (filtered by user's academy) |

**Query Parameters:** `academy_id` *(integer, optional)*

---

#### Get Class Grade by ID

| | |
|---|---|
| **Endpoint** | `GET /grades/:id` |
| **Access** | Authenticated (within academy) |

---

#### Update Class Grade

| | |
|---|---|
| **Endpoint** | `PATCH /grades/:id` |
| **Access** | `admin` |

---

#### Delete Class Grade

| | |
|---|---|
| **Endpoint** | `DELETE /grades/:id` |
| **Access** | `admin` |

---

### 3.2 Subject Endpoints

#### Create Subject

| | |
|---|---|
| **Endpoint** | `POST /subjects` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `academy_id` | integer | ✅ | |
| `name` | string | ✅ | |
| `display_name` | string | ✅ | |
| `subject_code` | string | ❌ | |
| `description` | string | ❌ | |
| `difficulty_level` | string | ❌ | `beginner`, `intermediate`, `advanced` |

**Success Response** `201 Created`

---

#### Get All Subjects

| | |
|---|---|
| **Endpoint** | `GET /subjects` |
| **Access** | Authenticated |

---

#### Get Subject by ID

| | |
|---|---|
| **Endpoint** | `GET /subjects/:id` |
| **Access** | Authenticated |

---

#### Update Subject

| | |
|---|---|
| **Endpoint** | `PATCH /subjects/:id` |
| **Access** | `admin` |

---

#### Delete Subject

| | |
|---|---|
| **Endpoint** | `DELETE /subjects/:id` |
| **Access** | `admin` |

---

### 3.3 Class-Subject Mapping

#### Assign Subject to Class

| | |
|---|---|
| **Endpoint** | `POST /assign` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `academy_id` | integer | ✅ | |
| `class_grade_id` | integer | ✅ | |
| `subject_id` | integer | ✅ | |
| `is_compulsory` | boolean | ❌ | Default: `true` |

**Success Response** `201 Created`

---

#### Get Subjects for a Class

| | |
|---|---|
| **Endpoint** | `GET /classes/:classId/subjects` |
| **Access** | Authenticated |

---

#### Get Classes for a Subject

| | |
|---|---|
| **Endpoint** | `GET /subjects/:subjectId/classes` |
| **Access** | Authenticated |

---

#### Update Mapping

| | |
|---|---|
| **Endpoint** | `PATCH /mappings/:id` |
| **Access** | `admin` |

---

#### Remove Mapping

| | |
|---|---|
| **Endpoint** | `DELETE /mappings/:id` |
| **Access** | `admin` |

---

## 4. Student & Parent Profiles

### 4.1 Student Profiles

#### Create Student Profile

| | |
|---|---|
| **Endpoint** | `POST /students` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `academy_id` | integer | ✅ | |
| `email` | string | ✅ | |
| `password` | string | ✅ | Minimum 6 characters |
| `full_name` | string | ✅ | |
| `phone` | string | ❌ | |
| `class_grade_id` | integer | ❌ | |
| `roll_number` | string | ❌ | |
| `admission_number` | string | ❌ | |
| `date_of_birth` | date | ❌ | |
| `gender` | string | ❌ | `male`, `female`, `other` |
| `address`, `emergency_contact_name`, etc. | mixed | ❌ | See model for all fields |

**Success Response** `201 Created` — includes `profile_id` and `user_id`

---

#### Get All Students

| | |
|---|---|
| **Endpoint** | `GET /students` |
| **Access** | `admin`, `teacher` |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `class_grade_id` | integer | Filter by class |
| `is_active` | boolean | Filter by active status |

---

#### Get Student by ID

| | |
|---|---|
| **Endpoint** | `GET /students/:id` |
| **Access** | `admin`, `teacher` |

Returns full profile with user details.

---

#### Get My Student Profile

| | |
|---|---|
| **Endpoint** | `GET /students/me` |
| **Access** | `student` |

---

#### Update Student Profile

| | |
|---|---|
| **Endpoint** | `PATCH /students/:id` |
| **Access** | `admin` |

---

#### Delete Student Profile

| | |
|---|---|
| **Endpoint** | `DELETE /students/:id` |
| **Access** | `admin` |

---

### 4.2 Parent Profiles

#### Create Parent Profile

| | |
|---|---|
| **Endpoint** | `POST /parents` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `academy_id` | integer | ✅ |
| `email` | string | ✅ |
| `password` | string | ✅ |
| `full_name` | string | ✅ |
| `phone` | string | ❌ |
| `occupation`, `annual_income`, `office_address`, etc. | mixed | ❌ |

**Success Response** `201 Created`

---

#### Get All Parents

| | |
|---|---|
| **Endpoint** | `GET /parents` |
| **Access** | `admin` |

---

#### Get Parent by ID

| | |
|---|---|
| **Endpoint** | `GET /parents/:id` |
| **Access** | `admin` |

---

#### Get My Parent Profile

| | |
|---|---|
| **Endpoint** | `GET /parents/me` |
| **Access** | `parent` |

---

#### Update Parent Profile

| | |
|---|---|
| **Endpoint** | `PATCH /parents/:id` |
| **Access** | `admin` |

---

#### Delete Parent Profile

| | |
|---|---|
| **Endpoint** | `DELETE /parents/:id` |
| **Access** | `admin` |

---

### 4.3 Parent-Student Linking

#### Link Parent to Student

| | |
|---|---|
| **Endpoint** | `POST /links` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `academy_id` | integer | ✅ | |
| `parent_id` | integer | ✅ | Profile ID |
| `student_id` | integer | ✅ | Profile ID |
| `relation` | string | ✅ | `father`, `mother`, `guardian`, `other` |
| `is_primary` | boolean | ❌ | |

**Success Response** `201 Created`

---

#### Get Parents of a Student

| | |
|---|---|
| **Endpoint** | `GET /students/:studentId/parents` |
| **Access** | `admin`, `teacher`, `parent` (own children only) |

---

#### Get Students of a Parent

| | |
|---|---|
| **Endpoint** | `GET /parents/:parentId/students` |
| **Access** | `admin`, `teacher`, `parent` (own only) |

---

#### Unlink Parent from Student

| | |
|---|---|
| **Endpoint** | `DELETE /links/:parentId/:studentId` |
| **Access** | `admin` |

---

#### Update Link

| | |
|---|---|
| **Endpoint** | `PATCH /links/:id` |
| **Access** | `admin` |

---

## 5. Attendance

### 5.1 Mark Single Attendance

| | |
|---|---|
| **Endpoint** | `POST /attendance/mark` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `student_id` | integer | ✅ | |
| `date` | date | ✅ | Format: `YYYY-MM-DD` |
| `status` | string | ✅ | `present`, `absent`, `late`, `excused`, `half_day` |
| `remarks` | string | ❌ | |

**Success Response** `201 Created`

---

### 5.2 Mark Bulk Attendance

| | |
|---|---|
| **Endpoint** | `POST /attendance/mark/bulk` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `class_grade_id` | integer | ✅ | |
| `date` | date | ✅ | Format: `YYYY-MM-DD` |
| `attendance` | array | ✅ | Array of `{ "student_id": 1, "status": "present", "remarks": "..." }` |

**Success Response** `201 Created` — includes count

---

### 5.3 Get Student Attendance

| | |
|---|---|
| **Endpoint** | `GET /attendance/students/:studentId` |
| **Access** | `admin`, `teacher`, `parent` |

**Query Parameters:**

| Parameter | Type | Required |
|---|---|---|
| `start_date` | date | ✅ |
| `end_date` | date | ✅ |

**Success Response** `200 OK` — Records array with a `stats` object

---

### 5.4 Get Class Attendance

| | |
|---|---|
| **Endpoint** | `GET /attendance/classes/:classId` |
| **Access** | `admin`, `teacher` |

**Query Parameters:** `date` *(date, required)* — Format: `YYYY-MM-DD`

**Success Response** `200 OK` — Attendance records with student names

---

### 5.5 Get My Attendance

| | |
|---|---|
| **Endpoint** | `GET /attendance/me` |
| **Access** | `student` |

**Query Parameters:** `start_date`, `end_date` *(both required)*

---

### 5.6 Update Attendance Record

| | |
|---|---|
| **Endpoint** | `PATCH /attendance/:id` |
| **Access** | `admin`, `teacher` |

**Request Body:** `status`, `remarks`

---

### 5.7 Delete Attendance Record

| | |
|---|---|
| **Endpoint** | `DELETE /attendance/:id` |
| **Access** | `admin` |

---

## 6. Homework

### 6.1 Create Homework Task

| | |
|---|---|
| **Endpoint** | `POST /homework/tasks` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | |
| `description` | string | ❌ | |
| `instructions` | string | ❌ | |
| `class_grade_id` | integer | ❌ | If provided, auto-assigns to all students in that class |
| `subject_id` | integer | ❌ | |
| `due_date` | datetime | ❌ | ISO 8601 format |
| `max_points` | float | ❌ | |

**Success Response** `201 Created`

---

### 6.2 Get All Tasks

| | |
|---|---|
| **Endpoint** | `GET /homework/tasks` |
| **Access** | `admin`, `teacher` |

**Query Parameters:** `class_grade_id`, `subject_id`, `teacher_id` *(all optional)*

---

### 6.3 Get Task by ID

| | |
|---|---|
| **Endpoint** | `GET /homework/tasks/:id` |
| **Access** | `admin`, `teacher` |

---

### 6.4 Update Task

| | |
|---|---|
| **Endpoint** | `PATCH /homework/tasks/:id` |
| **Access** | `admin`, `teacher` |

---

### 6.5 Delete Task

| | |
|---|---|
| **Endpoint** | `DELETE /homework/tasks/:id` |
| **Access** | `admin`, `teacher` |

---

### 6.6 Assign Task to Additional Students

| | |
|---|---|
| **Endpoint** | `POST /homework/tasks/:taskId/assign` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `student_ids` | array of integers | ✅ |

---

### 6.7 Get My Homework

| | |
|---|---|
| **Endpoint** | `GET /homework/students/me` |
| **Access** | `student` |

**Query Parameters:** `status` *(string, optional)* — Filter by status

---

### 6.8 Get Specific Student's Homework

| | |
|---|---|
| **Endpoint** | `GET /homework/students/:studentId` |
| **Access** | `admin`, `teacher`, `parent` |

---

### 6.9 Submit Homework

| | |
|---|---|
| **Endpoint** | `POST /homework/tasks/:taskId/submit` |
| **Access** | `student` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `submission_file_url` | string | ❌ | URL to the uploaded work |

**Success Response** `200 OK` — Status is set to `completed`

---

### 6.10 View Submissions for a Task

| | |
|---|---|
| **Endpoint** | `GET /homework/tasks/:taskId/submissions` |
| **Access** | `admin`, `teacher` |

**Success Response** `200 OK` — Array including student names and submission details

---

### 6.11 Grade Submission

| | |
|---|---|
| **Endpoint** | `PATCH /homework/submissions/:submissionId/grade` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `marks_obtained` | float | ❌ |
| `teacher_comments` | string | ❌ |

---

## 7. Lessons & Progress

### 7.1 Create Lesson

| | |
|---|---|
| **Endpoint** | `POST /lessons` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `class_subject_id` | integer | ✅ | |
| `title` | string | ✅ | |
| `lesson_order` | integer | ✅ | Position in sequence |
| `description` | string | ❌ | |
| `chapter_number` | integer | ❌ | |
| `chapter_name` | string | ❌ | |
| `page_numbers` | string | ❌ | |
| `estimated_duration_minutes` | integer | ❌ | |

**Success Response** `201 Created`

---

### 7.2 Get Lessons for a Class-Subject

| | |
|---|---|
| **Endpoint** | `GET /class-subjects/:classSubjectId/lessons` |
| **Access** | Authenticated (any role) |

**Success Response** `200 OK` — Array ordered by `lesson_order`

---

### 7.3 Get Lesson by ID

| | |
|---|---|
| **Endpoint** | `GET /lessons/:id` |
| **Access** | `admin`, `teacher` |

---

### 7.4 Update Lesson

| | |
|---|---|
| **Endpoint** | `PATCH /lessons/:id` |
| **Access** | `admin`, `teacher` |

---

### 7.5 Delete Lesson

| | |
|---|---|
| **Endpoint** | `DELETE /lessons/:id` |
| **Access** | `admin`, `teacher` |

---

### 7.6 Update Student Progress

| | |
|---|---|
| **Endpoint** | `POST /progress` |
| **Access** | `student` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `lesson_id` | integer | ✅ | |
| `status` | string | ❌ | `not_started`, `in_progress`, `completed`, `revised` |
| `mastery_level` | string | ❌ | `beginner`, `intermediate`, `advanced` |
| `notes` | string | ❌ | |

---

### 7.7 Get My Progress for a Class-Subject

| | |
|---|---|
| **Endpoint** | `GET /my-progress/:classSubjectId` |
| **Access** | `student` |

**Success Response** `200 OK` — Array of lesson progress

---

### 7.8 Get Student Progress

| | |
|---|---|
| **Endpoint** | `GET /students/:studentId/progress/:classSubjectId` |
| **Access** | `admin`, `teacher`, `parent` |

---

### 7.9 Get All Student Progress for a Lesson

| | |
|---|---|
| **Endpoint** | `GET /lessons/:lessonId/progress` |
| **Access** | `admin`, `teacher` |

---

## 8. Exams & Test Results

### 8.1 Create Exam

| | |
|---|---|
| **Endpoint** | `POST /exams` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | |
| `exam_type` | string | ✅ | `unit_test`, `mid_term`, `final`, `assignment`, `quiz` |
| `class_subject_id` | integer | ✅ | |
| `total_marks` | float | ✅ | |
| `passing_marks` | float | ✅ | |
| `scheduled_date` | datetime | ❌ | |
| `duration_minutes` | integer | ❌ | |
| `description` | string | ❌ | |
| `syllabus_coverage` | string | ❌ | |

**Success Response** `201 Created`

---

### 8.2 Get All Exams

| | |
|---|---|
| **Endpoint** | `GET /exams` |
| **Access** | `admin`, `teacher` |

**Query Parameters:** `class_subject_id`, `exam_type` *(both optional)*

---

### 8.3 Get Exam by ID

| | |
|---|---|
| **Endpoint** | `GET /exams/:id` |
| **Access** | `admin`, `teacher` |

---

### 8.4 Update Exam

| | |
|---|---|
| **Endpoint** | `PATCH /exams/:id` |
| **Access** | `admin`, `teacher` |

---

### 8.5 Delete Exam

| | |
|---|---|
| **Endpoint** | `DELETE /exams/:id` |
| **Access** | `admin`, `teacher` |

---

### 8.6 Add Single Test Result

| | |
|---|---|
| **Endpoint** | `POST /results` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `test_id` | integer | ✅ |
| `student_id` | integer | ✅ |
| `obtained_marks` | float | ✅ |
| `grade` | string | ❌ |
| `remarks` | string | ❌ |

**Success Response** `201 Created`

---

### 8.7 Add Bulk Results

| | |
|---|---|
| **Endpoint** | `POST /exams/:testId/results/bulk` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `results` | array | ✅ | Each object: `{ "student_id": 1, "obtained_marks": 85, "grade": "A", "remarks": "..." }` |

**Success Response** `201 Created`

---

### 8.8 Get Results for an Exam

| | |
|---|---|
| **Endpoint** | `GET /exams/:testId/results` |
| **Access** | `admin`, `teacher`, `student` (if enrolled), `parent` |

---

### 8.9 Get Student's Results

| | |
|---|---|
| **Endpoint** | `GET /students/:studentId/results` |
| **Access** | `admin`, `teacher`, `parent` |

---

### 8.10 Get My Results

| | |
|---|---|
| **Endpoint** | `GET /my-results` |
| **Access** | `student` |

---

### 8.11 Update a Result

| | |
|---|---|
| **Endpoint** | `PATCH /results/:id` |
| **Access** | `admin`, `teacher` |

---

## 9. Fee Management

### 9.1 Create Fee Structure

| | |
|---|---|
| **Endpoint** | `POST /fee-structures` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `class_grade_id` | integer | ✅ | |
| `fee_type` | string | ✅ | `tuition`, `transport`, `library`, `lab`, `sports`, `other` |
| `amount` | float | ✅ | |
| `frequency` | string | ✅ | `monthly`, `quarterly`, `annually`, `per_semester` |
| `effective_from` | date | ✅ | |
| `description` | string | ❌ | |
| `effective_to` | date | ❌ | |

**Success Response** `201 Created`

---

### 9.2 Get All Fee Structures

| | |
|---|---|
| **Endpoint** | `GET /fee-structures` |
| **Access** | `admin` |

---

### 9.3 Update Fee Structure

| | |
|---|---|
| **Endpoint** | `PATCH /fee-structures/:id` |
| **Access** | `admin` |

---

### 9.4 Delete Fee Structure

| | |
|---|---|
| **Endpoint** | `DELETE /fee-structures/:id` |
| **Access** | `admin` |

---

### 9.5 Record Payment

| | |
|---|---|
| **Endpoint** | `POST /payments` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `student_id` | integer | ✅ | |
| `amount` | float | ✅ | |
| `payment_date` | date | ✅ | |
| `payment_method` | string | ✅ | `cash`, `bank_transfer`, `card`, `cheque`, `online` |
| `for_month` | string | ✅ | |
| `for_year` | integer | ✅ | |
| `transaction_id` | string | ❌ | |
| `late_fee` | float | ❌ | |
| `discount` | float | ❌ | |
| `remarks` | string | ❌ | |

**Success Response** `201 Created` — includes receipt number

---

### 9.6 Get All Payments

| | |
|---|---|
| **Endpoint** | `GET /payments` |
| **Access** | `admin` |

**Query Parameters:** `student_id`, `status`, `for_month`, `for_year` *(all optional)*

---

### 9.7 Get Payment by ID

| | |
|---|---|
| **Endpoint** | `GET /payments/:id` |
| **Access** | `admin` |

---

### 9.8 Update Payment

| | |
|---|---|
| **Endpoint** | `PATCH /payments/:id` |
| **Access** | `admin` |

---

### 9.9 Delete Payment

| | |
|---|---|
| **Endpoint** | `DELETE /payments/:id` |
| **Access** | `admin` |

---

### 9.10 Get Student Payments

| | |
|---|---|
| **Endpoint** | `GET /students/:studentId/payments` |
| **Access** | `admin`, `parent` |

---

### 9.11 Get My Payments

| | |
|---|---|
| **Endpoint** | `GET /my-payments` |
| **Access** | `student` |

---

### 9.12 Get Student Fee Status

| | |
|---|---|
| **Endpoint** | `GET /students/:studentId/fee-status` |
| **Access** | `admin`, `parent` |

**Success Response** `200 OK` — Applicable fees, payments, and balance due

---

## 10. Teacher Salary Management

### 10.1 Create Salary Structure

| | |
|---|---|
| **Endpoint** | `POST /salary-structures` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `teacher_id` | integer | ✅ | |
| `salary_type` | string | ✅ | `monthly`, `hourly`, `per_class` |
| `base_salary` | float | ✅ | |
| `effective_from` | date | ✅ | |
| `qualification_bonus` | float | ❌ | |
| `performance_bonus` | float | ❌ | |
| `subject_id` | integer | ❌ | |
| `class_grade_id` | integer | ❌ | |
| `experience_years` | integer | ❌ | |

**Success Response** `201 Created` — includes calculated `total_salary`

---

### 10.2 Get All Salary Structures

| | |
|---|---|
| **Endpoint** | `GET /salary-structures` |
| **Access** | `admin` |

---

### 10.3 Update Salary Structure

| | |
|---|---|
| **Endpoint** | `PATCH /salary-structures/:id` |
| **Access** | `admin` |

---

### 10.4 Delete Salary Structure

| | |
|---|---|
| **Endpoint** | `DELETE /salary-structures/:id` |
| **Access** | `admin` |

---

### 10.5 Get Teacher's Salary History

| | |
|---|---|
| **Endpoint** | `GET /teachers/:teacherId/salaries` |
| **Access** | `admin`, `teacher` (self only) |

---

### 10.6 Get My Salaries

| | |
|---|---|
| **Endpoint** | `GET /my-salaries` |
| **Access** | `teacher` |

---

### 10.7 Record Salary Payment

| | |
|---|---|
| **Endpoint** | `POST /salary-payments` |
| **Access** | `admin` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `teacher_id` | integer | ✅ | |
| `amount` | float | ✅ | |
| `payment_date` | date | ✅ | |
| `payment_method` | string | ✅ | `bank_transfer`, `cash`, `cheque`, `online` |
| `for_month` | string | ✅ | |
| `for_year` | integer | ✅ | |
| `deductions` | float | ❌ | |
| `status` | string | ❌ | `pending`, `paid`, `cancelled` |
| `remarks` | string | ❌ | |
| `transaction_id` | string | ❌ | |

**Success Response** `201 Created` — includes `net_amount`

---

### 10.8 Get All Salary Payments

| | |
|---|---|
| **Endpoint** | `GET /salary-payments` |
| **Access** | `admin` |

**Query Parameters:** `teacher_id`, `status`, `for_month`, `for_year` *(all optional)*

---

### 10.9 Get Payment by ID

| | |
|---|---|
| **Endpoint** | `GET /salary-payments/:id` |
| **Access** | `admin` |

---

### 10.10 Update Payment

| | |
|---|---|
| **Endpoint** | `PATCH /salary-payments/:id` |
| **Access** | `admin` |

---

### 10.11 Delete Payment

| | |
|---|---|
| **Endpoint** | `DELETE /salary-payments/:id` |
| **Access** | `admin` |

---

### 10.12 Get Teacher's Payments

| | |
|---|---|
| **Endpoint** | `GET /teachers/:teacherId/payments` |
| **Access** | `admin`, `teacher` (self only) |

---

### 10.13 Get My Salary Payments

| | |
|---|---|
| **Endpoint** | `GET /my-salary-payments` |
| **Access** | `teacher` |

---

## 11. Notifications

### 11.1 Send Single Notification

| | |
|---|---|
| **Endpoint** | `POST /notifications` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `receiver_id` | integer | ✅ | |
| `title` | string | ✅ | |
| `message` | string | ✅ | |
| `notification_type` | string | ✅ | `attendance`, `homework`, `exam`, `fee`, `performance`, `admission`, `general` |
| `priority` | string | ❌ | `low`, `medium`, `high`, `urgent` — Default: `medium` |
| `metadata` | object | ❌ | Additional JSON data |

**Success Response** `201 Created`

---

### 11.2 Send Bulk Notifications

| | |
|---|---|
| **Endpoint** | `POST /notifications/bulk` |
| **Access** | `admin`, `teacher` |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `notifications` | array | ✅ | Array of notification objects (same fields as single) |

**Success Response** `201 Created` — includes count

---

### 11.3 Get My Notifications

| | |
|---|---|
| **Endpoint** | `GET /notifications` |
| **Access** | Authenticated |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `is_read` | boolean | Filter by read status |
| `notification_type` | string | Filter by type |

**Success Response** `200 OK` — Array with `unread_count`

---

### 11.4 Get Unread Count

| | |
|---|---|
| **Endpoint** | `GET /notifications/unread-count` |
| **Access** | Authenticated |

**Success Response** `200 OK` — `{ "unread_count": 5 }`

---

### 11.5 Mark Single Notification as Read

| | |
|---|---|
| **Endpoint** | `PATCH /notifications/:id/read` |
| **Access** | Authenticated (receiver only) |

---

### 11.6 Mark All Notifications as Read

| | |
|---|---|
| **Endpoint** | `PATCH /notifications/read-all` |
| **Access** | Authenticated |

**Success Response** `200 OK` — includes count of updated records

---

### 11.7 Delete Notification

| | |
|---|---|
| **Endpoint** | `DELETE /notifications/:id` |
| **Access** | Authenticated (receiver or admin) |

---

### 11.8 Get All Notifications *(Admin)*

| | |
|---|---|
| **Endpoint** | `GET /notifications/all` |
| **Access** | `admin` |

**Query Parameters:** `receiver_id`, `is_read`, `notification_type` *(all optional)*

**Success Response** `200 OK` — Full details including sender/receiver names

---

## 12. PDF Reports

### 12.1 Generate Attendance Report

| | |
|---|---|
| **Endpoint** | `GET /reports/attendance` |
| **Access** | `admin`, `teacher` |

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `studentId` | integer | ✅ | |
| `period` | string | ✅ | Format: `YYYY-MM-DD,YYYY-MM-DD` |

**Success Response** `201 Created` — Report metadata including file name

---

### 12.2 Generate Performance Report

| | |
|---|---|
| **Endpoint** | `GET /reports/performance` |
| **Access** | `admin`, `teacher` |

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `studentId` | integer | ✅ | |
| `period` | string | ✅ | e.g., `Q1 2024` |

---

### 12.3 Generate Fee Report

| | |
|---|---|
| **Endpoint** | `GET /reports/fee` |
| **Access** | `admin`, `teacher` |

**Query Parameters:** `studentId` *(required)*, `period` *(required)*

---

### 12.4 Generate Exam Report

| | |
|---|---|
| **Endpoint** | `GET /reports/exam` |
| **Access** | `admin`, `teacher` |

**Query Parameters:** `examId` *(integer, required)*

---

### 12.5 List All Reports

| | |
|---|---|
| **Endpoint** | `GET /reports` |
| **Access** | `admin`, `teacher` |

**Query Parameters:** `report_type`, `student_id`, `class_grade_id` *(all optional)*

---

### 12.6 Get Report Metadata

| | |
|---|---|
| **Endpoint** | `GET /reports/:id` |
| **Access** | `admin`, `teacher` |

**Success Response** `200 OK` — Report details including `report_data`

---

### 12.7 Download Report File

| | |
|---|---|
| **Endpoint** | `GET /reports/:id/download` |
| **Access** | `admin`, `teacher` |

**Success Response** — PDF file download

---

### 12.8 Delete Report

| | |
|---|---|
| **Endpoint** | `DELETE /reports/:id` |
| **Access** | `admin` |

> **Note:** Also deletes the physical file from disk.

---

## Error Codes

| Status Code | Meaning |
|---|---|
| `200` | OK — Request succeeded |
| `201` | Created — Resource created |
| `400` | Bad Request — Invalid input |
| `401` | Unauthorized — Missing or invalid token |
| `403` | Forbidden — Insufficient permissions |
| `404` | Not Found — Resource doesn't exist |
| `409` | Conflict — Duplicate entry |
| `429` | Too Many Requests — Rate limit exceeded |
| `500` | Internal Server Error |

---

## Rate Limiting

All endpoints are subject to rate limiting: **100 requests per 15 minutes per IP**. Exceeding this limit returns a `429` status.

---

## Notes

- All dates must be in **ISO 8601** format (`YYYY-MM-DD`) or as a full datetime string.
- Boolean values must be `true` or `false` (case-sensitive).
- For file uploads (homework submissions, profile images), this version does not include direct upload endpoints — URLs to pre-hosted files are expected instead.
- Authentication tokens expire after **7 days** by default.