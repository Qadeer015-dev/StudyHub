-- Create academies table
CREATE TABLE IF NOT EXISTS academies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    street TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    academy_email VARCHAR(255) UNIQUE NOT NULL,
    establishment_date DATE,
    website VARCHAR(255),
    logo_url VARCHAR(500),
    description TEXT,
    status ENUM('pending', 'active', 'inactive', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create index for faster lookups
-- CREATE INDEX idx_academies_email ON academies(email);
-- CREATE INDEX idx_academies_status ON academies(status);
-- CREATE INDEX idx_academies_owner_email ON academies(owner_email);