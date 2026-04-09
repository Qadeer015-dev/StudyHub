-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    class_subject_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    chapter_number INT,
    chapter_name VARCHAR(255),
    page_numbers VARCHAR(100),
    lesson_order INT NOT NULL,
    estimated_duration_minutes INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_lessons_academy_id (academy_id),
    INDEX idx_lessons_class_subject_id (class_subject_id),
    INDEX idx_lessons_lesson_order (lesson_order),
    INDEX idx_lessons_status (is_active)
);

-- Create student_lesson_progress table
CREATE TABLE IF NOT EXISTS student_lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    student_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed', 'revised') DEFAULT 'not_started',
    mastery_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    notes TEXT,
    start_date DATETIME,
    completion_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate progress records
    UNIQUE KEY unique_lesson_progress (academy_id, student_id, lesson_id),
    
    -- Indexes
    INDEX idx_lesson_progress_academy_id (academy_id),
    INDEX idx_lesson_progress_student_id (student_id),
    INDEX idx_lesson_progress_lesson_id (lesson_id),
    INDEX idx_lesson_progress_status (status)
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    exam_type ENUM('unit_test', 'mid_term', 'final', 'assignment', 'quiz') NOT NULL,
    class_subject_id INT NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    passing_marks DECIMAL(5,2) NOT NULL,
    duration_minutes INT,
    scheduled_date DATETIME,
    description TEXT,
    syllabus_coverage TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_exams_academy_id (academy_id),
    INDEX idx_exams_class_subject_id (class_subject_id),
    INDEX idx_exams_exam_type (exam_type),
    INDEX idx_exams_scheduled_date (scheduled_date),
    INDEX idx_exams_status (is_active)
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    obtained_marks DECIMAL(5,2) NOT NULL,
    grade VARCHAR(10),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_test_results_academy_id (academy_id),
    INDEX idx_test_results_test_id (test_id),
    INDEX idx_test_results_student_id (student_id),
    INDEX idx_test_results_obtained_marks (obtained_marks)
);

-- Create progress_reports table
CREATE TABLE IF NOT EXISTS progress_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    report_type ENUM('mid_term', 'final', 'periodic', 'special') NOT NULL,
    academic_period VARCHAR(100) NOT NULL,
    overall_grade VARCHAR(10),
    attendance_percentage DECIMAL(5,2),
    behavior_rating ENUM('excellent', 'good', 'average', 'needs_improvement') DEFAULT 'average',
    participation_rating ENUM('excellent', 'good', 'average', 'needs_improvement') DEFAULT 'average',
    strengths TEXT,
    weaknesses TEXT,
    teacher_comments TEXT,
    recommendations TEXT,
    parent_acknowledged BOOLEAN DEFAULT FALSE,
    parent_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_progress_reports_academy_id (academy_id),
    INDEX idx_progress_reports_student_id (student_id),
    INDEX idx_progress_reports_teacher_id (teacher_id),
    INDEX idx_progress_reports_report_type (report_type),
    INDEX idx_progress_reports_academic_period (academic_period)
);