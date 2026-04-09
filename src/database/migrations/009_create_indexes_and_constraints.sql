-- Create additional indexes for performance optimization
CREATE INDEX idx_users_academy_role ON users(academy_id, is_active);
CREATE INDEX idx_student_profiles_academy_class ON student_profiles(academy_id, class_grade_id, is_active);
CREATE INDEX idx_homework_tasks_academy_class_subject ON homework_tasks(academy_id, class_grade_id, subject_id, deleted_at);
CREATE INDEX idx_test_results_academy_student_test ON test_results(academy_id, student_id, test_id);
CREATE INDEX idx_fee_payments_academy_student_date ON fee_payments(academy_id, student_id, payment_date);
CREATE INDEX idx_salary_payments_academy_teacher_date ON salary_payments(academy_id, teacher_id, payment_date);
CREATE INDEX idx_notifications_academy_receiver_read ON notifications(academy_id, receiver_id, is_read);
CREATE INDEX idx_admission_requests_academy_status ON admission_requests(academy_id, status);

-- Create composite unique constraints
ALTER TABLE student_profiles ADD CONSTRAINT unique_academy_roll_number UNIQUE (academy_id, roll_number);
ALTER TABLE student_profiles ADD CONSTRAINT unique_academy_admission_number UNIQUE (academy_id, admission_number);
ALTER TABLE fee_structures ADD CONSTRAINT unique_academy_class_subject_fee UNIQUE (academy_id, class_grade_id, subject_id, fee_type, effective_from);
ALTER TABLE teacher_salaries ADD CONSTRAINT unique_academy_teacher_effective UNIQUE (academy_id, teacher_id, effective_from);

-- Create foreign key constraints for existing tables
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE;
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_marked_by FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE homework_tasks ADD CONSTRAINT fk_homework_tasks_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE homework_tasks ADD CONSTRAINT fk_homework_tasks_class_grade FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL;
ALTER TABLE homework_tasks ADD CONSTRAINT fk_homework_tasks_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE student_homework ADD CONSTRAINT fk_student_homework_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE;
ALTER TABLE student_homework ADD CONSTRAINT fk_student_homework_homework FOREIGN KEY (homework_id) REFERENCES homework_tasks(id) ON DELETE CASCADE;
ALTER TABLE lessons ADD CONSTRAINT fk_lessons_class_subject FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE;
ALTER TABLE student_lesson_progress ADD CONSTRAINT fk_lesson_progress_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE;
ALTER TABLE student_lesson_progress ADD CONSTRAINT fk_lesson_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
ALTER TABLE exams ADD CONSTRAINT fk_exams_class_subject FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE;
ALTER TABLE test_results ADD CONSTRAINT fk_test_results_test FOREIGN KEY (test_id) REFERENCES exams(id) ON DELETE CASCADE;
ALTER TABLE test_results ADD CONSTRAINT fk_test_results_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE;
ALTER TABLE progress_reports ADD CONSTRAINT fk_progress_reports_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE;
ALTER TABLE progress_reports ADD CONSTRAINT fk_progress_reports_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE fee_structures ADD CONSTRAINT fk_fee_structures_class_grade FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE CASCADE;
ALTER TABLE fee_structures ADD CONSTRAINT fk_fee_structures_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE fee_payments ADD CONSTRAINT fk_fee_payments_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE;
ALTER TABLE fee_payments ADD CONSTRAINT fk_fee_payments_paid_by FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE teacher_salaries ADD CONSTRAINT fk_teacher_salaries_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE teacher_salaries ADD CONSTRAINT fk_teacher_salaries_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE teacher_salaries ADD CONSTRAINT fk_teacher_salaries_class_grade FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL;
ALTER TABLE salary_payments ADD CONSTRAINT fk_salary_payments_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE admission_requests ADD CONSTRAINT fk_admission_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE admission_requests ADD CONSTRAINT fk_admission_requests_class_grade FOREIGN KEY (applied_for_class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL;
ALTER TABLE admission_requests ADD CONSTRAINT fk_admission_requests_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE pdf_reports ADD CONSTRAINT fk_pdf_reports_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE SET NULL;
ALTER TABLE pdf_reports ADD CONSTRAINT fk_pdf_reports_class_grade FOREIGN KEY (class_grade_id) REFERENCES class_grades(id) ON DELETE SET NULL;
ALTER TABLE pdf_reports ADD CONSTRAINT fk_pdf_reports_generated_by FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE;