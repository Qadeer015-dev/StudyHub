-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    sender_id INT,
    receiver_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('attendance', 'homework', 'exam', 'fee', 'performance', 'admission', 'general') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_notifications_academy_id (academy_id),
    INDEX idx_notifications_receiver_id (receiver_id),
    INDEX idx_notifications_notification_type (notification_type),
    INDEX idx_notifications_priority (priority),
    INDEX idx_notifications_is_read (is_read),
    INDEX idx_notifications_created_at (created_at)
);

-- Create admission_requests table
CREATE TABLE IF NOT EXISTS admission_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    user_id INT NOT NULL,
    request_type ENUM('teacher', 'student') NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    applied_for_class_grade_id INT,
    documents JSON,
    additional_info TEXT,
    reviewed_by INT,
    review_comments TEXT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (applied_for_class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_admission_requests_academy_id (academy_id),
    INDEX idx_admission_requests_user_id (user_id),
    INDEX idx_admission_requests_status (status),
    INDEX idx_admission_requests_request_type (request_type)
);

-- Create pdf_reports table
CREATE TABLE IF NOT EXISTS pdf_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    report_type ENUM('attendance', 'performance', 'fee', 'exam', 'progress', 'comprehensive') NOT NULL,
    student_id INT,
    class_grade_id INT,
    academic_period VARCHAR(100),
    report_data JSON NOT NULL,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    generated_by INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_pdf_reports_academy_id (academy_id),
    INDEX idx_pdf_reports_report_type (report_type),
    INDEX idx_pdf_reports_student_id (student_id),
    INDEX idx_pdf_reports_class_grade_id (class_grade_id),
    INDEX idx_pdf_reports_generated_at (generated_at)
);