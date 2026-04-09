const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
    constructor() {
        this.doc = new PDFDocument({ margin: 50 });
    }

    generateHeader(title, subtitle = null) {
        this.doc.fontSize(20).text(title, { align: 'center' });
        if (subtitle) {
            this.doc.fontSize(12).text(subtitle, { align: 'center' });
        }
        this.doc.moveDown();
    }

    generateFooter() {
        this.doc.fontSize(10).text(
            `Generated on ${new Date().toLocaleString()}`,
            50,
            this.doc.page.height - 50,
            { align: 'center' }
        );
    }

    generateTable(headers, rows, columnWidths) {
        const tableTop = this.doc.y + 10;
        let currentTop = tableTop;

        // Draw headers
        this.doc.font('Helvetica-Bold');
        headers.forEach((header, i) => {
            this.doc.text(
                header,
                50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
                currentTop,
                { width: columnWidths[i], align: 'left' }
            );
        });
        this.doc.font('Helvetica');
        currentTop += 20;

        // Draw rows
        rows.forEach(row => {
            // Check for page break
            if (currentTop > this.doc.page.height - 100) {
                this.doc.addPage();
                currentTop = 50;
                // Redraw headers
                this.doc.font('Helvetica-Bold');
                headers.forEach((header, i) => {
                    this.doc.text(
                        header,
                        50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
                        currentTop,
                        { width: columnWidths[i], align: 'left' }
                    );
                });
                this.doc.font('Helvetica');
                currentTop += 20;
            }

            row.forEach((cell, i) => {
                this.doc.text(
                    cell?.toString() || '',
                    50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
                    currentTop,
                    { width: columnWidths[i], align: 'left' }
                );
            });
            currentTop += 20;
        });

        this.doc.moveDown();
        return currentTop;
    }

    generateAttendanceReport(data) {
        const { student_name, class_name, period, records, summary } = data;
        this.generateHeader('Attendance Report', `${student_name} - ${class_name} (${period})`);

        // Summary
        this.doc.fontSize(12).text('Summary', { underline: true });
        this.doc.text(`Total Days: ${summary.total_days}`);
        this.doc.text(`Present: ${summary.present_days} | Absent: ${summary.absent_days} | Late: ${summary.late_days}`);
        this.doc.text(`Attendance Percentage: ${((summary.present_days / summary.total_days) * 100).toFixed(1)}%`);
        this.doc.moveDown();

        // Detailed records
        const headers = ['Date', 'Status', 'Remarks'];
        const rows = records.map(r => [r.date, r.status, r.remarks || '']);
        this.generateTable(headers, rows, [100, 100, 200]);
        this.generateFooter();
    }

    generatePerformanceReport(data) {
        const { student_name, class_name, period, subjects, overall_grade } = data;
        this.generateHeader('Performance Report', `${student_name} - ${class_name} (${period})`);

        this.doc.fontSize(12).text(`Overall Grade: ${overall_grade}`, { align: 'right' });
        this.doc.moveDown();

        const headers = ['Subject', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade'];
        const rows = subjects.map(s => [
            s.subject_name,
            s.obtained_marks,
            s.total_marks,
            `${((s.obtained_marks / s.total_marks) * 100).toFixed(1)}%`,
            s.grade
        ]);
        this.generateTable(headers, rows, [120, 80, 80, 80, 80]);
        this.generateFooter();
    }

    generateFeeReport(data) {
        const { student_name, class_name, period, payments, total_paid, balance_due } = data;
        this.generateHeader('Fee Payment Report', `${student_name} - ${class_name} (${period})`);

        this.doc.fontSize(12).text(`Total Paid: $${total_paid}`, { continued: true });
        this.doc.text(` | Balance Due: $${balance_due}`, { align: 'right' });
        this.doc.moveDown();

        const headers = ['Date', 'Amount', 'Method', 'Month', 'Receipt No'];
        const rows = payments.map(p => [
            p.payment_date,
            `$${p.amount}`,
            p.payment_method,
            p.for_month,
            p.receipt_number
        ]);
        this.generateTable(headers, rows, [100, 80, 100, 80, 120]);
        this.generateFooter();
    }

    generateExamReport(data) {
        const { exam_title, class_name, date, results } = data;
        this.generateHeader('Exam Results Report', `${exam_title} - ${class_name} (${date})`);

        const headers = ['Roll No', 'Student Name', 'Marks', 'Percentage', 'Grade'];
        const rows = results.map(r => [
            r.roll_number,
            r.student_name,
            `${r.obtained_marks}/${r.total_marks}`,
            `${((r.obtained_marks / r.total_marks) * 100).toFixed(1)}%`,
            r.grade
        ]);
        this.generateTable(headers, rows, [80, 150, 80, 80, 80]);
        this.generateFooter();
    }

    getDocument() {
        return this.doc;
    }
}

module.exports = PDFGenerator;