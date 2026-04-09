const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;
if(process.env.NODE_ENV === 'production') {
pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,                    // Required for batch execution
    initSql: "SET SESSION tidb_multi_statement_mode = 'ON'"  // TiDB‑specific
});
} else {
pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true                     // Required for batch execution
});
}

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Test database connection
        await pool.execute('SELECT 1');
        console.log('✓ Database connection established');

        // Insert sample academy
        const [academyResult] = await pool.execute(`
      INSERT INTO academies (uuid, name, registration_number, email, phone, owner_name, owner_phone, owner_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            'acad-001', 'Sample Academy', 'REG-2024-001', 'admin@sampleacademy.edu', '1234567890',
            'John Doe', '0300-1234567', 'john.doe@sampleacademy.edu'
        ]);
        const academyId = academyResult.insertId;
        console.log(`✓ Sample academy created with ID: ${academyId}`);

        // Insert sample users
        const users = [
            {
                uuid: 'user-001',
                academy_id: academyId,
                email: 'admin@sampleacademy.edu',
                phone: '1234567890',
                password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                full_name: 'Admin User',
                is_verified: true
            },
            {
                uuid: 'user-002',
                academy_id: academyId,
                email: 'teacher@sampleacademy.edu',
                phone: '1234567891',
                password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                full_name: 'Teacher User',
                is_verified: true
            },
            {
                uuid: 'user-003',
                academy_id: academyId,
                email: 'student@sampleacademy.edu',
                phone: '1234567892',
                password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                full_name: 'Student User',
                is_verified: true
            },
            {
                uuid: 'user-004',
                academy_id: academyId,
                email: 'parent@sampleacademy.edu',
                phone: '1234567893',
                password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                full_name: 'Parent User',
                is_verified: true
            }
        ];

        for (const user of users) {
            const [userResult] = await pool.execute(`
        INSERT INTO users SET ?
      `, user);
            console.log(`✓ User created: ${user.full_name} (ID: ${userResult.insertId})`);
        }

        // Insert user roles
        const userRoles = [
            { user_id: 1, role: 'admin', academy_id: academyId, assigned_by: 1 },
            { user_id: 2, role: 'teacher', academy_id: academyId, assigned_by: 1 },
            { user_id: 3, role: 'student', academy_id: academyId, assigned_by: 1 },
            { user_id: 4, role: 'parent', academy_id: academyId, assigned_by: 1 }
        ];

        for (const role of userRoles) {
            await pool.execute(`
        INSERT INTO user_roles SET ?
      `, role);
        }
        console.log('✓ User roles assigned');

        // Insert sample class grades
        const classGrades = [
            { academy_id: academyId, name: 'Grade 1', display_name: 'First Grade', grade_level: 1 },
            { academy_id: academyId, name: 'Grade 2', display_name: 'Second Grade', grade_level: 2 },
            { academy_id: academyId, name: 'Grade 3', display_name: 'Third Grade', grade_level: 3 }
        ];

        for (const grade of classGrades) {
            const [gradeResult] = await pool.execute(`
        INSERT INTO class_grades SET ?
      `, grade);
            console.log(`✓ Class grade created: ${grade.name} (ID: ${gradeResult.insertId})`);
        }

        // Insert sample subjects
        const subjects = [
            { academy_id: academyId, name: 'Mathematics', display_name: 'Math', subject_code: 'MATH', difficulty_level: 'intermediate' },
            { academy_id: academyId, name: 'English', display_name: 'English', subject_code: 'ENG', difficulty_level: 'intermediate' },
            { academy_id: academyId, name: 'Science', display_name: 'Science', subject_code: 'SCI', difficulty_level: 'intermediate' }
        ];

        for (const subject of subjects) {
            const [subjectResult] = await pool.execute(`
        INSERT INTO subjects SET ?
      `, subject);
            console.log(`✓ Subject created: ${subject.name} (ID: ${subjectResult.insertId})`);
        }

        // Insert sample student profile
        const [studentProfileResult] = await pool.execute(`
      INSERT INTO student_profiles (academy_id, user_id, class_grade_id, roll_number, admission_number, date_of_admission, date_of_birth, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [academyId, 3, 1, 'ROLL-001', 'ADM-001', '2024-01-15', '2015-05-20', 'male']);
        console.log(`✓ Student profile created (ID: ${studentProfileResult.insertId})`);

        // Insert sample parent profile and link
        await pool.execute(`
      INSERT INTO parent_profiles (academy_id, user_id) VALUES (?, ?)
    `, [academyId, 4]);
        console.log('✓ Parent profile created');

        await pool.execute(`
      INSERT INTO parent_student_links (academy_id, parent_id, student_id, relation) VALUES (?, ?, ?, ?)
    `, [academyId, 4, studentProfileResult.insertId, 'father']);
        console.log('✓ Parent-student link created');

        console.log('✓ Database seeding completed successfully!');
        await pool.end();
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        await pool.end();
        process.exit(1);
    }
}

// Run the seed
seedDatabase();