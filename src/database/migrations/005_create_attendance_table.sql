-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused', 'half_day') NOT NULL,
    remarks TEXT,
    marked_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate attendance records
    UNIQUE KEY unique_attendance (academy_id, student_id, date),
    
    -- Indexes
    INDEX idx_attendance_academy_id (academy_id),
    INDEX idx_attendance_student_id (student_id),
    INDEX idx_attendance_date (date),
    INDEX idx_attendance_status (status),
    INDEX idx_attendance_marked_by (marked_by)
);

-- Create homework_tasks table
CREATE TABLE IF NOT EXISTS homework_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    teacher_id INT NOT NULL,
    class_grade_id INT,
    subject_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date DATETIME,
    max_points DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_homework_tasks_academy_id (academy_id),
    INDEX idx_homework_tasks_teacher_id (teacher_id),
    INDEX idx_homework_tasks_class_grade_id (class_grade_id),
    INDEX idx_homework_tasks_subject_id (subject_id),
    INDEX idx_homework_tasks_due_date (due_date),
    INDEX idx_homework_tasks_status (deleted_at)
);

-- Create student_homework table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS student_homework (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    student_id INT NOT NULL,
    homework_id INT NOT NULL,
    status ENUM('assigned', 'in_progress', 'completed', 'late', 'not_submitted') DEFAULT 'assigned',
    submission_date DATETIME,
    submission_file_url VARCHAR(500),
    marks_obtained DECIMAL(5,2),
    teacher_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (homework_id) REFERENCES homework_tasks(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate student-homework assignments
    UNIQUE KEY unique_student_homework (academy_id, student_id, homework_id),
    
    -- Indexes
    INDEX idx_student_homework_academy_id (academy_id),
    INDEX idx_student_homework_student_id (student_id),
    INDEX idx_student_homework_homework_id (homework_id),
    INDEX idx_student_homework_status (status)
);