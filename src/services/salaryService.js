const TeacherSalaryModel = require('../models/teacherSalaryModel');
const SalaryPaymentModel = require('../models/salaryPaymentModel');
const UserModel = require('../models/userModel');
const AppError = require('../utils/AppError');

class SalaryService {
    static async createSalaryStructure(data, academyId) {
        const { teacher_id, salary_type, base_salary, effective_from } = data;

        // Verify teacher exists and has teacher role
        const teacher = await UserModel.findById(teacher_id);
        if (!teacher) throw new AppError('Teacher not found', 404);

        // Calculate total salary
        const qualification_bonus = data.qualification_bonus || 0;
        const performance_bonus = data.performance_bonus || 0;
        const total_salary = base_salary + qualification_bonus + performance_bonus;

        const salaryData = {
            ...data,
            academy_id: academyId,
            total_salary
        };

        const id = await TeacherSalaryModel.create(salaryData);
        return { id, total_salary, message: 'Salary structure created successfully' };
    }

    static async getAllSalaryStructures(academyId, filters) {
        return await TeacherSalaryModel.findAll(academyId, filters);
    }

    static async getTeacherSalaries(teacherId, academyId) {
        const salaries = await TeacherSalaryModel.findByTeacher(teacherId, academyId);
        if (!salaries.length) throw new AppError('No salary records found for this teacher', 404);
        return salaries;
    }

    static async getMySalaries(userId, academyId) {
        return await TeacherSalaryModel.findByTeacher(userId, academyId);
    }

    static async updateSalaryStructure(id, data, academyId) {
        const structure = await TeacherSalaryModel.findById(id, academyId);
        if (!structure) throw new AppError('Salary structure not found', 404);

        // Recalculate total if base/bonus changed
        if (data.base_salary !== undefined || data.qualification_bonus !== undefined || data.performance_bonus !== undefined) {
            const base = data.base_salary ?? structure.base_salary;
            const qBonus = data.qualification_bonus ?? structure.qualification_bonus;
            const pBonus = data.performance_bonus ?? structure.performance_bonus;
            data.total_salary = base + qBonus + pBonus;
        }

        await TeacherSalaryModel.update(id, data);
        return { message: 'Salary structure updated successfully' };
    }

    static async deleteSalaryStructure(id, academyId) {
        const structure = await TeacherSalaryModel.findById(id, academyId);
        if (!structure) throw new AppError('Salary structure not found', 404);
        await TeacherSalaryModel.softDelete(id);
        return { message: 'Salary structure deleted successfully' };
    }

    static async recordPayment(data, academyId) {
        const { teacher_id, amount, payment_date, payment_method, for_month, for_year, deductions = 0 } = data;

        // Verify teacher exists
        const teacher = await UserModel.findById(teacher_id);
        if (!teacher) throw new AppError('Teacher not found', 404);

        const net_amount = amount - deductions;

        const paymentData = {
            academy_id: academyId,
            teacher_id,
            amount,
            payment_date,
            payment_method,
            for_month,
            for_year,
            deductions,
            net_amount,
            status: data.status || 'paid',
            remarks: data.remarks || null,
            transaction_id: data.transaction_id || null
        };

        const paymentId = await SalaryPaymentModel.create(paymentData);
        return { id: paymentId, net_amount, message: 'Salary payment recorded successfully' };
    }

    static async getAllPayments(academyId, filters) {
        return await SalaryPaymentModel.findAll(academyId, filters);
    }

    static async getTeacherPayments(teacherId, academyId) {
        return await SalaryPaymentModel.findByTeacher(teacherId, academyId);
    }

    static async getMyPayments(userId, academyId) {
        return await SalaryPaymentModel.findByTeacher(userId, academyId);
    }

    static async getPaymentById(paymentId, academyId) {
        const payment = await SalaryPaymentModel.findById(paymentId, academyId);
        if (!payment) throw new AppError('Payment not found', 404);
        return payment;
    }

    static async updatePayment(paymentId, data, academyId) {
        const payment = await SalaryPaymentModel.findById(paymentId, academyId);
        if (!payment) throw new AppError('Payment not found', 404);

        // Recalculate net amount if amount/deductions changed
        if (data.amount !== undefined || data.deductions !== undefined) {
            const amount = data.amount ?? payment.amount;
            const deductions = data.deductions ?? payment.deductions;
            data.net_amount = amount - deductions;
        }

        await SalaryPaymentModel.update(paymentId, data);
        return { message: 'Payment updated successfully' };
    }

    static async deletePayment(paymentId, academyId) {
        const payment = await SalaryPaymentModel.findById(paymentId, academyId);
        if (!payment) throw new AppError('Payment not found', 404);
        await SalaryPaymentModel.delete(paymentId);
        return { message: 'Payment deleted successfully' };
    }
}

module.exports = SalaryService;