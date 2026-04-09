-- Create fee_structures table
CREATE TABLE IF NOT EXISTS fee_structures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    class_grade_id INT NOT NULL,
    subject_id INT,
    fee_type ENUM('tuition', 'transport', 'library', 'lab', 'sports', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency ENUM('monthly', 'quarterly', 'annually', 'per_semester') NOT NULL,
    description TEXT,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_fee_structures_academy_id (academy_id),
    INDEX idx_fee_structures_class_grade_id (class_grade_id),
    INDEX idx_fee_structures_subject_id (subject_id),
    INDEX idx_fee_structures_fee_type (fee_type),
    INDEX idx_fee_structures_effective_from (effective_from),
    INDEX idx_fee_structures_status (is_active)
);

-- Create fee_payments table
CREATE TABLE IF NOT EXISTS fee_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    student_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'card', 'cheque', 'online') NOT NULL,
    transaction_id VARCHAR(100),
    status ENUM('pending', 'paid', 'overdue', 'refunded') DEFAULT 'pending',
    for_month VARCHAR(20),
    for_year INT,
    late_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    remarks TEXT,
    receipt_number VARCHAR(100) UNIQUE,
    paid_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_fee_payments_academy_id (academy_id),
    INDEX idx_fee_payments_student_id (student_id),
    INDEX idx_fee_payments_payment_date (payment_date),
    INDEX idx_fee_payments_status (status),
    INDEX idx_fee_payments_receipt_number (receipt_number)
);

-- Create teacher_salaries table
CREATE TABLE IF NOT EXISTS teacher_salaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    teacher_id INT NOT NULL,
    salary_type ENUM('monthly', 'hourly', 'per_class') NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    subject_id INT,
    class_grade_id INT,
    experience_years INT,
    qualification_bonus DECIMAL(10,2) DEFAULT 0,
    performance_bonus DECIMAL(10,2) DEFAULT 0,
    total_salary DECIMAL(10,2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_teacher_salaries_academy_id (academy_id),
    INDEX idx_teacher_salaries_teacher_id (teacher_id),
    INDEX idx_teacher_salaries_salary_type (salary_type),
    INDEX idx_teacher_salaries_effective_from (effective_from),
    INDEX idx_teacher_salaries_status (is_active)
);

-- Create salary_payments table
CREATE TABLE IF NOT EXISTS salary_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy_id INT NOT NULL,
    teacher_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('bank_transfer', 'cash', 'cheque', 'online') NOT NULL,
    transaction_id VARCHAR(100),
    for_month VARCHAR(20) NOT NULL,
    for_year INT NOT NULL,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_salary_payments_academy_id (academy_id),
    INDEX idx_salary_payments_teacher_id (teacher_id),
    INDEX idx_salary_payments_payment_date (payment_date),
    INDEX idx_salary_payments_status (status)
);