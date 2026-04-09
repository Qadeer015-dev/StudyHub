-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    user_id INT NOT NULL,
    class_grade_id INT,
    roll_number VARCHAR(50) UNIQUE,
    admission_number VARCHAR(50) UNIQUE,
    date_of_admission DATE,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    blood_group VARCHAR(10),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(100),
    medical_conditions TEXT,
    allergies TEXT,
    medications TEXT,
    special_needs TEXT,
    previous_school VARCHAR(255),
    transfer_certificate_url VARCHAR(500),
    birth_certificate_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_student_profiles_academy_id (academy_id),
    INDEX idx_student_profiles_user_id (user_id),
    INDEX idx_student_profiles_class_grade_id (class_grade_id),
    INDEX idx_student_profiles_roll_number (roll_number),
    INDEX idx_student_profiles_admission_number (admission_number),
    INDEX idx_student_profiles_status (is_active)
);

-- Create parent_student_links table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS parent_student_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    parent_id INT NOT NULL,
    student_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    relation ENUM('father', 'mother', 'guardian', 'other') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate parent-student links
    UNIQUE KEY unique_parent_student (academy_id, parent_id, student_id),
    
    -- Indexes
    INDEX idx_parent_student_links_academy_id (academy_id),
    INDEX idx_parent_student_links_parent_id (parent_id),
    INDEX idx_parent_student_links_student_id (student_id)
);

-- Create parent_profiles table
CREATE TABLE IF NOT EXISTS parent_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    user_id INT NOT NULL,
    occupation VARCHAR(100),
    annual_income DECIMAL(12,2),
    office_address TEXT,
    office_phone VARCHAR(20),
    qualification VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_parent_profiles_academy_id (academy_id),
    INDEX idx_parent_profiles_user_id (user_id),
    INDEX idx_parent_profiles_status (is_active)
);