const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

// Fixed bcrypt hash for "password" (cost 12)
const DEFAULT_PASSWORD_HASH = '$2b$10$a.kpmaBLb5Uz90aJZ7OrRuF.KHv8jtNliQQIZ3qv5YK5qa6wOSLW6';

// Helper: generate UUID v4
function generateUUID() {
    return crypto.randomUUID();
}

// Helper: random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: pick random element from array
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Create connection pool
let pool;
if (process.env.NODE_ENV === 'production') {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
        initSql: "SET SESSION tidb_multi_statement_mode = 'ON'"
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
        multipleStatements: true
    });
}

// Clear existing data (order respects foreign keys)
async function clearTables() {
    const tables = [
        'pdf_reports', 'salary_payments', 'teacher_salaries', 'fee_payments',
        'fee_structures', 'progress_reports', 'test_results', 'exams',
        'student_lesson_progress', 'lessons', 'student_homework', 'homework_tasks',
        'attendance', 'parent_student_links', 'parent_profiles', 'student_profiles',
        'user_roles', 'class_subjects', 'subjects', 'class_grades', 'users', 'academies'
    ];
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of tables) {
        await pool.query(`TRUNCATE TABLE ${table}`);
    }
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Cleared existing data');
}

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        await pool.query('SELECT 1');
        console.log('✓ Database connection established');

        // Clear old data
        await clearTables();

        const academiesCount = 10;
        const usersPerRole = 10;

        // Global counters for unique emails/phones
        let globalEmailCounter = 1;
        let globalPhoneCounter = 1;

        // ----- 1. Create Academies -----
        const academyIds = [];
        for (let i = 1; i <= academiesCount; i++) {
            const uuid = generateUUID();
            const name = `Demo Academy ${i}`;
            const registrationNumber = `REG-${String(i).padStart(4, '0')}`;
            const street = `${123 + i} Main Street`;
            const city = `City${i}`;
            const state = `State${i}`;
            const country = 'CountryXYZ';
            const postalCode = `${10000 + i}`;
            const academyEmail = `academy${i}@example.com`;
            const establishmentDate = `2020-01-${String(i).padStart(2, '0')}`;
            const website = `https://academy${i}.example.com`;
            const logoUrl = `https://example.com/logos/academy${i}.png`;
            const description = `This is demo academy number ${i}.`;
            const status = 'active';

            const [res] = await pool.query(
                `INSERT INTO academies 
                 (uuid, name, registration_number, street, city, state, country, postal_code,
                  academy_email, establishment_date, website, logo_url, description, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [uuid, name, registrationNumber, street, city, state, country, postalCode,
                    academyEmail, establishmentDate, website, logoUrl, description, status]
            );
            academyIds.push(res.insertId);
            console.log(`✓ Academy ${i} created with ID ${res.insertId}`);
        }

        // ----- 2. For each academy, create base data and users -----
        for (let idx = 0; idx < academyIds.length; idx++) {
            const academyId = academyIds[idx];
            console.log(`\n--- Processing Academy ID ${academyId} (${idx + 1}/${academiesCount}) ---`);

            // Start transaction for this academy
            const conn = await pool.getConnection();
            await conn.beginTransaction();

            try {
                // ----- 2.1 Class Grades (5 grades per academy) -----
                const gradeIds = [];
                for (let g = 1; g <= 5; g++) {
                    const [res] = await conn.query(
                        `INSERT INTO class_grades (academy_id, name, display_name, grade_level, is_active)
                         VALUES (?, ?, ?, ?, ?)`,
                        [academyId, `Grade ${g}`, `${g}th Grade`, g, true]
                    );
                    gradeIds.push(res.insertId);
                }
                console.log(`  ✓ Created ${gradeIds.length} class grades`);

                // ----- 2.2 Subjects (7 subjects per academy) -----
                const subjectNames = [
                    'Mathematics', 'English', 'Science', 'Social Studies',
                    'Computer Science', 'Art', 'Physical Education'
                ];
                const subjectIds = [];
                for (let s = 0; s < subjectNames.length; s++) {
                    const name = subjectNames[s];
                    const displayName = name;
                    const subjectCode = `${academyId}_${name.substring(0, 3).toUpperCase()}_${s}`;
                    const [res] = await conn.query(
                        `INSERT INTO subjects (academy_id, name, display_name, subject_code, difficulty_level, is_active)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [academyId, name, displayName, subjectCode, 'intermediate', true]
                    );
                    subjectIds.push(res.insertId);
                }
                console.log(`  ✓ Created ${subjectIds.length} subjects`);

                // ----- 2.3 Class-Subjects mapping (all combinations) -----
                for (const gradeId of gradeIds) {
                    for (const subjectId of subjectIds) {
                        await conn.query(
                            `INSERT INTO class_subjects (academy_id, class_grade_id, subject_id, is_compulsory, is_active)
                             VALUES (?, ?, ?, ?, ?)`,
                            [academyId, gradeId, subjectId, true, true]
                        );
                    }
                }
                console.log(`  ✓ Created ${gradeIds.length * subjectIds.length} class-subject mappings`);

                // Helper to insert a user with a specific role
                const createUserWithRole = async (role, additionalProfileCallback = null) => {
                    const uuid = generateUUID();
                    const email = `user_${globalEmailCounter++}@example.com`;
                    const phone = `+${1234567890 + globalPhoneCounter++}`;
                    const fullName = `${role.charAt(0).toUpperCase() + role.slice(1)} User ${globalEmailCounter}`;
                    const dateOfBirth = `1990-01-${String(randomInt(1, 28)).padStart(2, '0')}`;
                    const gender = randomElement(['male', 'female', 'other']);
                    const address = `${randomInt(100, 999)} Example St`;
                    const city = 'DemoCity';
                    const state = 'DemoState';
                    const country = 'DemoCountry';
                    const postalCode = `${randomInt(10000, 99999)}`;

                    const [userRes] = await conn.query(
                        `INSERT INTO users 
                         (uuid, academy_id, email, phone, password_hash, full_name, date_of_birth,
                          gender, address, city, state, country, postal_code, is_verified, is_active)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [uuid, academyId, email, phone, DEFAULT_PASSWORD_HASH, fullName, dateOfBirth,
                            gender, address, city, state, country, postalCode, true, true]
                    );
                    const userId = userRes.insertId;

                    // Assign role
                    await conn.query(
                        `INSERT INTO user_roles (user_id, role, academy_id, assigned_by, is_active)
                         VALUES (?, ?, ?, ?, ?)`,
                        [userId, role, academyId, 1, true]  // assigned_by = first admin (will be created later, but safe)
                    );

                    // If additional profile callback (for student or parent), call it
                    if (additionalProfileCallback) {
                        await additionalProfileCallback(userId);
                    }
                    return userId;
                };

                // ----- 2.4 Create 10 Admins (no extra profile) -----
                const adminIds = [];
                for (let a = 0; a < usersPerRole; a++) {
                    const adminId = await createUserWithRole('admin');
                    adminIds.push(adminId);
                }
                console.log(`  ✓ Created ${adminIds.length} admins`);

                // ----- 2.5 Create 10 Teachers (no extra profile) -----
                const teacherIds = [];
                for (let t = 0; t < usersPerRole; t++) {
                    const teacherId = await createUserWithRole('teacher');
                    teacherIds.push(teacherId);
                }
                console.log(`  ✓ Created ${teacherIds.length} teachers`);

                // ----- 2.6 Create 10 Students (with student_profiles) -----
                const studentIds = [];
                const studentUserIdMap = new Map(); // student_user_id -> student_profile_id
                for (let s = 0; s < usersPerRole; s++) {
                    const studentUserId = await createUserWithRole('student', async (userId) => {
                        // Create student profile
                        const rollNumber = `ROLL-${academyId}-${String(s + 1).padStart(3, '0')}`;
                        const admissionNumber = `ADM-${academyId}-${String(s + 1).padStart(3, '0')}`;
                        const dateOfAdmission = `2024-${randomInt(1, 12)}-${randomInt(1, 28)}`;
                        const dob = `2015-${randomInt(1, 12)}-${randomInt(1, 28)}`;
                        const genderStudent = randomElement(['male', 'female', 'other']);
                        const classGradeId = randomElement(gradeIds);

                        const [profileRes] = await conn.query(
                            `INSERT INTO student_profiles 
                             (academy_id, user_id, class_grade_id, roll_number, admission_number,
                              date_of_admission, date_of_birth, gender, is_active)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [academyId, userId, classGradeId, rollNumber, admissionNumber,
                                dateOfAdmission, dob, genderStudent, true]
                        );
                        studentUserIdMap.set(userId, profileRes.insertId);
                        return profileRes.insertId;
                    });
                    studentIds.push(studentUserId);
                }
                console.log(`  ✓ Created ${studentIds.length} students with profiles`);

                // ----- 2.7 Create 10 Parents (with parent_profiles) -----
                const parentIds = [];
                const parentUserIdMap = new Map(); // parent_user_id -> parent_profile_id
                for (let p = 0; p < usersPerRole; p++) {
                    const parentUserId = await createUserWithRole('parent', async (userId) => {
                        const [profileRes] = await conn.query(
                            `INSERT INTO parent_profiles (academy_id, user_id, occupation, is_active)
                             VALUES (?, ?, ?, ?)`,
                            [academyId, userId, `Occupation ${p + 1}`, true]
                        );
                        parentUserIdMap.set(userId, profileRes.insertId);
                    });
                    parentIds.push(parentUserId);
                }
                console.log(`  ✓ Created ${parentIds.length} parents with profiles`);

                // ----- 2.8 Link students to parents (each student gets 1-2 parents) -----
                const allParentUserIds = Array.from(parentUserIdMap.keys());
                for (const [studentUserId, studentProfileId] of studentUserIdMap.entries()) {
                    // Number of parents for this student: 1 or 2
                    const numParents = randomInt(1, 2);
                    const shuffledParents = [...allParentUserIds];
                    for (let i = shuffledParents.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledParents[i], shuffledParents[j]] = [shuffledParents[j], shuffledParents[i]];
                    }
                    const selectedParents = shuffledParents.slice(0, numParents);
                    for (let idxParent = 0; idxParent < selectedParents.length; idxParent++) {
                        const parentUserId = selectedParents[idxParent];
                        const isPrimary = (idxParent === 0); // first one is primary
                        const relation = randomElement(['father', 'mother', 'guardian', 'other']);
                        await conn.query(
                            `INSERT INTO parent_student_links 
                             (academy_id, parent_id, student_id, is_primary, relation)
                             VALUES (?, ?, ?, ?, ?)`,
                            [academyId, parentUserId, studentProfileId, isPrimary, relation]
                        );
                    }
                }
                console.log(`  ✓ Linked students to parents`);

                // Commit transaction for this academy
                await conn.commit();
                conn.release();
                console.log(`  ✓ Academy ${academyId} seeded successfully`);

            } catch (err) {
                await conn.rollback();
                conn.release();
                console.error(`  ✗ Failed to seed academy ${academyId}:`, err.message);
                throw err;
            }
        }

        console.log('\n✓ Database seeding completed successfully!');
        await pool.end();
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        await pool.end();
        process.exit(1);
    }
}

// Run the seed
seedDatabase();