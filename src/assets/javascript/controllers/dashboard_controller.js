import { ApplicationController } from "./applicationController.js";

export default class DashboardController extends ApplicationController {
    static targets = [
        "totalStudents",
        "totalClasses",
        "teachers",
        "feeCollected",
        "recentPaymentsList",
        "recentAttendanceList"
    ];

    connect() {
        console.log("Admin dashboard connected");
        this.get();
    }

    async get() {
        try {
            const res = await fetch(`/api/v1/dashboard`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            this.data = result.data;
            this.render();
        } catch (err) {
            this.showError("loginError", err.message);
            this.data = { counts: {}, recent_payments: [], recent_attendance: [], fee_collection_this_month: 0 };
            this.render();
        }
    }

    render() {
        // Counts
        const students = this.data?.counts?.students ?? 0;
        const classes = this.data?.counts?.classes ?? 0;
        const teachers = this.data?.counts?.teachers ?? 0;
        const feeCollected = this.data?.fee_collection_this_month ?? 0;

        if (this.hasTotalStudentsTarget) this.totalStudentsTarget.textContent = students;
        if (this.hasTotalClassesTarget) this.totalClassesTarget.textContent = classes;
        if (this.hasTeachersTarget) this.teachersTarget.textContent = teachers;
        if (this.hasFeeCollectedTarget) this.feeCollectedTarget.textContent = feeCollected;

        // Recent Payments
        const payments = this.data?.recent_payments ?? [];
        this.renderRecentPayments(payments);

        // Recent Attendance
        const attendances = this.data?.recent_attendance ?? [];
        this.renderRecentAttendance(attendances);
    }

    renderRecentPayments(payments) {
        const container = this.recentPaymentsListTarget;
        if (!container) return;

        if (payments.length === 0) {
            container.innerHTML = '<li class="list-group-item text-muted">No recent payments</li>';
            return;
        }

        container.innerHTML = payments.map(payment => {
            // Adjust property names based on your actual API response
            const studentName = payment.student_name || payment.student?.full_name || `Student #${payment.student_id}`;
            const amount = payment.amount ?? 0;
            const date = payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'Unknown date';
            return `<li class="list-group-item">💰 ${studentName} paid <strong>$${amount}</strong> on ${date}</li>`;
        }).join('');
    }

    renderRecentAttendance(attendances) {
        const container = this.recentAttendanceListTarget;
        if (!container) return;

        if (attendances.length === 0) {
            container.innerHTML = '<li class="list-group-item text-muted">No recent attendance records</li>';
            return;
        }

        container.innerHTML = attendances.map(att => {
            const studentName = att.student_name || att.student?.full_name || `Student #${att.student_id}`;
            const date = att.date ? new Date(att.date).toLocaleDateString() : 'Unknown date';
            const status = att.status === 'present' ? '✅ Present' : (att.status === 'absent' ? '❌ Absent' : '📝 ' + (att.status || 'Unknown'));
            return `<li class="list-group-item">📋 ${studentName} – ${status} on ${date}</li>`;
        }).join('');
    }
}