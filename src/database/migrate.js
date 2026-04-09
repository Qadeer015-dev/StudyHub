// migrate.js
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

// Array of migration files in order
const migrations = [
    '001_create_academies_table.sql',
    '002_create_users_table.sql',
    '003_create_class_grades_table.sql',
    '004_create_student_profiles_table.sql',
    '005_create_attendance_table.sql',
    '006_create_performance_and_exam_tables.sql',
    '007_create_fee_and_salary_tables.sql',
    '008_create_notification_and_report_tables.sql',
    '009_create_indexes_and_constraints.sql',
    '010_add_student_comments.sql'
];

async function runMigration(migrationFile) {
    try {
        const migrationPath = `src/database/migrations/${migrationFile}`;
        const migrationContent = require('fs').readFileSync(migrationPath, 'utf8');

        await pool.query(migrationContent);   // ← changed from execute
        console.log(`✓ Migration ${migrationFile} executed successfully`);
    } catch (error) {
        console.error(`✗ Error executing migration ${migrationFile}:`, error.message);
        throw error;
    }
}

async function runAllMigrations() {
    try {
        console.log('Starting database migration...');

        // Test database connection
        await pool.execute('SELECT 1');
        console.log('✓ Database connection established');

        // Run migrations in order
        for (const migration of migrations) {
            await runMigration(migration);
        }

        console.log('✓ All migrations completed successfully');
        console.log('✓ Database setup is complete!');

        await pool.end();
    } catch (error) {
        console.error('✗ Migration failed:', error);
        await pool.end();
        process.exit(1);
    }
}

// Run the migrations
runAllMigrations();