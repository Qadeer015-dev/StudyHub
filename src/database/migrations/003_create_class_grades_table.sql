-- Create class grades table
CREATE TABLE IF NOT EXISTS class_grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    grade_level INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_class_grades_academy_id (academy_id),
    INDEX idx_class_grades_grade_level (grade_level),
    INDEX idx_class_grades_status (is_active)
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    description TEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_subjects_academy_id (academy_id),
    INDEX idx_subjects_difficulty (difficulty_level),
    INDEX idx_subjects_status (is_active)
);

-- Create class_subjects table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS class_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    class_grade_id INT NOT NULL,
    subject_id INT NOT NULL,
    is_compulsory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate class-subject mappings
    UNIQUE KEY unique_class_subject (academy_id, class_grade_id, subject_id),
    
    -- Indexes
    INDEX idx_class_subjects_academy_id (academy_id),
    INDEX idx_class_subjects_class_grade_id (class_grade_id),
    INDEX idx_class_subjects_subject_id (subject_id),
    INDEX idx_class_subjects_status (is_active)
);