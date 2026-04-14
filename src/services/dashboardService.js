const pool = require('../config/db');
const AppError = require('../utils/AppError');

class DashboardService {
    // Admin Dashboard Summary
    static async getAdminDashboard(academyId) {
        // Total counts
        const [[studentCount]] = await pool.execute(
            `SELECT COUNT(*) as total FROM student_profiles WHERE academy_id = ? AND deleted_at IS NULL`,
            [academyId]
        );
        const [[teacherCount]] = await pool.execute(
            `SELECT COUNT(DISTINCT u.id) as total 
       FROM users u 
       JOIN user_roles ur ON u.id = ur.user_id 
       WHERE ur.role = 'teacher' AND u.academy_id = ? AND u.deleted_at IS NULL`,
            [academyId]
        );
        const [[parentCount]] = await pool.execute(
            `SELECT COUNT(DISTINCT u.id) as total 
       FROM users u 
       JOIN user_roles ur ON u.id = ur.user_id 
       WHERE ur.role = 'parent' AND u.academy_id = ? AND u.deleted_at IS NULL`,
            [academyId]
        );
        const [[classCount]] = await pool.execute(
            `SELECT COUNT(*) as total FROM class_grades WHERE academy_id = ? AND deleted_at IS NULL`,
            [academyId]
        );

        // Recent activity
        const [recentPayments] = await pool.execute(
            `SELECT fp.amount, fp.payment_date, u.full_name as student_name 
       FROM fee_payments fp 
       JOIN student_profiles sp ON fp.student_id = sp.id 
       JOIN users u ON sp.user_id = u.id 
       WHERE fp.academy_id = ? 
       ORDER BY fp.created_at DESC LIMIT 5`,
            [academyId]
        );
        const [recentAttendance] = await pool.execute(
            `SELECT a.date, a.status, u.full_name as student_name 
       FROM attendance a 
       JOIN student_profiles sp ON a.student_id = sp.id 
       JOIN users u ON sp.user_id = u.id 
       WHERE a.academy_id = ? 
       ORDER BY a.created_at DESC LIMIT 5`,
            [academyId]
        );

        // Fee collection summary (current month)
        const currentMonth = new Date().toISOString().slice(0, 7);
        const [[feeSummary]] = await pool.execute(
            `SELECT SUM(amount) as total_collected FROM fee_payments 
       WHERE academy_id = ? AND DATE_FORMAT(payment_date, '%Y-%m') = ? AND status = 'paid'`,
            [academyId, currentMonth]
        );

        return {
            counts: {
                students: studentCount.total,
                teachers: teacherCount.total,
                parents: parentCount.total,
                classes: classCount.total,
            },
            recent_payments: recentPayments,
            recent_attendance: recentAttendance,
            fee_collection_this_month: feeSummary.total_collected || 0,
        };
    }

    // Teacher Dashboard Summary
    static async getTeacherDashboard(teacherId, academyId) {
        // Classes taught by this teacher (via class_subjects mapping)
        const [classes] = await pool.execute(
            `SELECT DISTINCT cg.id, cg.name, cg.display_name 
       FROM class_grades cg
       JOIN class_subjects cs ON cg.id = cs.class_grade_id
       WHERE cs.academy_id = ? AND cs.id IN (
         SELECT DISTINCT class_subject_id FROM lessons WHERE academy_id = ? AND deleted_at IS NULL
         -- Ideally, teacher-specific assignments would be in a teacher_class_subjects table.
         -- For now, we assume teacher teaches all subjects in the academy (adjust as needed).
       )
       LIMIT 5`,
            [academyId, academyId]
        );

        // Upcoming exams in the next 7 days
        const [upcomingExams] = await pool.execute(
            `SELECT e.title, e.scheduled_date, cg.name as class_name 
       FROM exams e 
       JOIN class_subjects cs ON e.class_subject_id = cs.id 
       JOIN class_grades cg ON cs.class_grade_id = cg.id 
       WHERE e.academy_id = ? AND e.scheduled_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY e.scheduled_date LIMIT 5`,
            [academyId]
        );

        // Pending homework submissions
        const [pendingHomework] = await pool.execute(
            `SELECT ht.title, ht.due_date, COUNT(sh.id) as pending_count 
       FROM homework_tasks ht 
       LEFT JOIN student_homework sh ON ht.id = sh.homework_id AND sh.status != 'completed'
       WHERE ht.academy_id = ? AND ht.teacher_id = ? AND ht.deleted_at IS NULL
       GROUP BY ht.id 
       ORDER BY ht.due_date LIMIT 5`,
            [academyId, teacherId]
        );

        // Today's attendance summary for teacher's classes
        const today = new Date().toISOString().slice(0, 10);
        const [[attendanceSummary]] = await pool.execute(
            `SELECT 
         SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
         SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
         SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late
       FROM attendance a
       WHERE a.academy_id = ? AND a.date = ?`,
            [academyId, today]
        );

        return {
            classes,
            upcoming_exams: upcomingExams,
            pending_homework: pendingHomework,
            today_attendance: {
                present: attendanceSummary?.present || 0,
                absent: attendanceSummary?.absent || 0,
                late: attendanceSummary?.late || 0,
            },
        };
    }

    // Student Dashboard Summary
    static async getStudentDashboard(studentId, academyId) {
        // Today's attendance
        const today = new Date().toISOString().slice(0, 10);
        const [[todayAttendance]] = await pool.execute(
            `SELECT status FROM attendance WHERE student_id = ? AND date = ? AND academy_id = ?`,
            [studentId, today, academyId]
        );

        // Upcoming homework due within 7 days
        const [upcomingHomework] = await pool.execute(
            `SELECT ht.title, ht.due_date, sh.status 
       FROM homework_tasks ht 
       JOIN student_homework sh ON ht.id = sh.homework_id 
       WHERE sh.student_id = ? AND ht.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       AND sh.status != 'completed'
       ORDER BY ht.due_date LIMIT 5`,
            [studentId]
        );

        // Recent test results (last 5)
        const [recentResults] = await pool.execute(
            `SELECT e.title, tr.obtained_marks, e.total_marks, tr.grade 
       FROM test_results tr 
       JOIN exams e ON tr.test_id = e.id 
       WHERE tr.student_id = ? AND tr.academy_id = ? 
       ORDER BY e.scheduled_date DESC LIMIT 5`,
            [studentId, academyId]
        );

        // Fee status
        const [feeStatus] = await pool.execute(
            `SELECT SUM(amount) as total_paid 
       FROM fee_payments 
       WHERE student_id = ? AND academy_id = ? AND status = 'paid'`,
            [studentId, academyId]
        );
        // Get expected fee amount (simplified: sum of active fee structures for the student's class)
        const [[studentClass]] = await pool.execute(
            `SELECT class_grade_id FROM student_profiles WHERE id = ?`, [studentId]
        );
        let expectedFee = 0;
        if (studentClass?.class_grade_id) {
            const [[feeSum]] = await pool.execute(
                `SELECT SUM(amount) as total FROM fee_structures 
         WHERE class_grade_id = ? AND academy_id = ? AND is_active = TRUE AND deleted_at IS NULL`,
                [studentClass.class_grade_id, academyId]
            );
            expectedFee = feeSum?.total || 0;
        }
        const paid = feeStatus[0]?.total_paid || 0;
        const balance = expectedFee - paid;

        return {
            today_attendance: todayAttendance?.status || 'not_marked',
            upcoming_homework: upcomingHomework,
            recent_results: recentResults,
            fee_summary: {
                total_paid: paid,
                balance_due: balance > 0 ? balance : 0,
            },
        };
    }

    // Parent Dashboard Summary
    static async getParentDashboard(parentId, academyId) {
        // Get children linked to this parent
        const [children] = await pool.execute(
            `SELECT sp.id as student_id, u.full_name, sp.roll_number, cg.name as class_name
       FROM parent_student_links psl 
       JOIN student_profiles sp ON psl.student_id = sp.id 
       JOIN users u ON sp.user_id = u.id 
       LEFT JOIN class_grades cg ON sp.class_grade_id = cg.id
       WHERE psl.parent_id = ? AND psl.academy_id = ? AND sp.deleted_at IS NULL`,
            [parentId, academyId]
        );

        if (children.length === 0) {
            return { children: [], summary: null };
        }

        // For each child, get today's attendance and recent results
        const childrenSummaries = await Promise.all(children.map(async (child) => {
            const today = new Date().toISOString().slice(0, 10);
            const [[att]] = await pool.execute(
                `SELECT status FROM attendance WHERE student_id = ? AND date = ? AND academy_id = ?`,
                [child.student_id, today, academyId]
            );
            const [results] = await pool.execute(
                `SELECT e.title, tr.obtained_marks, e.total_marks, tr.grade 
         FROM test_results tr 
         JOIN exams e ON tr.test_id = e.id 
         WHERE tr.student_id = ? ORDER BY e.scheduled_date DESC LIMIT 3`,
                [child.student_id]
            );
            return {
                ...child,
                today_attendance: att?.status || 'not_marked',
                recent_results: results,
            };
        }));

        // Unread notifications count
        const [[unreadCount]] = await pool.execute(
            `SELECT COUNT(*) as count FROM notifications 
       WHERE receiver_id = ? AND academy_id = ? AND is_read = FALSE`,
            [parentId, academyId]
        );

        return {
            children: childrenSummaries,
            unread_notifications: unreadCount.count,
        };
    }
}

module.exports = DashboardService;