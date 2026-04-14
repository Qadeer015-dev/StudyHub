import { ApplicationController } from "../applicationController.js";
import { TableComponent } from "../../core/tableComponent.js";
import { Toast } from "../../core/toast.js";
import { Auth } from "../../core/auth.js"

export default class UserManagementController extends ApplicationController {
    connect() {
        console.log("Admin dashboard connected");
       
        const raw = document.getElementById("user-data").textContent;

        this.userData = JSON.parse(raw);
        this.academyId = this.userData.academy_id;

        this.columns = [
            { key: "full_name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "created_at", label: "Created At" },
        ];
    }

    // 🔥 PAGE ROUTER ENTRY
    async index() {
        this.getStudents();
        this.getTeachers();
    }

    async new() {
        const role = this.getRoleFromURL();
        console.log(`New ${role} page loaded`);

        this.bindForm(role);
    }

    async show() {
        const { id, role } = this.getParamsFromURL();

        const res = await fetch(`/api/v1/users/${id}`);
        const result = await res.json();

        const data = result.data;

        this.renderShowPage(data, role);
    }

    async edit() {
        const { id, role } = this.getParamsFromURL();

        const res = await fetch(`/api/v1/users/${id}`);
        const result = await res.json();

        const data = result.data;

        this.renderEditPage(data, role);
    }


    renderEditPage(data, role) {
        this.fullNameTarget.value = data.full_name;
        this.emailTarget.value = data.email;
        this.phoneTarget.value = data.phone || "";

        this.formTarget.addEventListener("submit", (e) =>
            this.updateUser(e, data.id, role)
        );
    }

    async updateUser(e, id, role) {
        e.preventDefault();

        const payload = {
            full_name: this.fullNameTarget.value,
            email: this.emailTarget.value,
            phone: this.phoneTarget.value
        };

        try {
            const res = await fetch(`/api/v1/users/${id}?_method=PATCH`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            Toast.show({ message: "User updated successfully" });

            setTimeout(() => {
                window.location.href = `/${role}/${id}`;
            }, 1000);

        } catch (err) {
            Toast.show({ message: err.message });
        }
    }

    async getStudents() {
        try {
            const res = await fetch(`/api/v1/users?role=student&academy_id=${this.academyId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            console.log(result.data);
            this.renderStudents(result.data);
        } catch (err) {
           console.log(err);
        }
    }

    async getTeachers() {
        try {
            const res = await fetch(`/api/v1/users?role=teacher&academy_id=${this.academyId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            console.log(result.data);
            this.renderTeachers(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    renderStudents(data) {
        if (!this.hasStudentsListTarget) return;

        this.studentTable = new TableComponent({
            element: this.studentsListTarget,
            columns: this.columns,
            data,
            pageSize: 5
        });

        this.studentTable.onView = (item) => {
            window.location.href = `/students/${item.id}`
        }

        this.studentTable.onEdit = (item) => {
            window.location.href = `/students/${item.id}/edit`
        };

        this.studentTable.onDelete = async (item) => {
            if (confirm(`Delete ${item.full_name}?`)) {

                // remove from UI instantly (optimistic)
                const originalData = [...this.studentTable.fullData];
                this.studentTable.updateData(
                    originalData.filter(u => u.id !== item.id)
                );

                let undone = false;

                Toast.show({
                    message: `${item.full_name} deleted`,
                    actionText: "Undo",
                    onAction: () => {
                        undone = true;
                        this.studentTable.updateData(originalData);
                    }
                });

                // wait before actual API call
                setTimeout(async () => {
                    if (undone) return;

                    try {
                        // call API here
                        const res = await fetch(`/api/v1/users/${item.id}?_method=DELETE`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include"
                        })

                        const result = await res.json();
                        if (!res.ok) throw new Error(result.message);

                        this.getStudents();
                    } catch (err) {
                        console.log(err);
                    }
                }, 5000);
            }
        };

        this.studentTable.render();
    }

    renderTeachers(data) {
        if (!this.hasTeachersListTarget) return;

        this.teacherTable = new TableComponent({
            element: this.teachersListTarget,
            columns: this.columns,
            data,
            pageSize: 5
        });

        // 🔥 attach actions
        this.teacherTable.onView = (item) => {
            window.location.href = `/teachers/${item.id}`
        }

        this.teacherTable.onEdit = (item) => {
            window.location.href = `/teachers/${item.id}/edit`
        };

        this.teacherTable.onDelete = async (item) => {
            if (confirm(`Delete ${item.full_name}?`)) {

                // remove from UI instantly (optimistic)
                const originalData = [...this.teacherTable.fullData];
                this.teacherTable.updateData(
                    originalData.filter(u => u.id !== item.id)
                );

                let undone = false;

                Toast.show({
                    message: `${item.full_name} deleted`,
                    actionText: "Undo",
                    onAction: () => {
                        undone = true;
                        this.teacherTable.updateData(originalData);
                    }
                });

                // wait before actual API call
                setTimeout(async () => {
                    if (undone) return;

                    try {
                        // call API here
                        const res = await fetch(`/api/v1/users/${item.id}?_method=DELETE`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include"
                        })

                        const result = await res.json();
                        if (!res.ok) throw new Error(result.message);

                        this.getTeachers();
                    } catch (err) {
                        console.log(err);
                    }
                }, 5000);
            }
        };

        this.teacherTable.render();
    }

    getParamsFromURL() {
        const parts = window.location.pathname.split("/").filter(Boolean);

        return {
            role: parts[0],   // students / teachers
            id: parts.includes("edit") ? parts[parts.length - 2] : parts[parts.length - 1]
        };
    }

    getRoleFromURL() {
        return window.location.pathname.split("/")[1];
    }

    bindForm(role) {
        if (!this.hasFormTarget) return;

        this.formTarget.addEventListener("submit", (e) => this.createUser(e, role));
    }

    async createUser(e, role) {
        e.preventDefault();

        const payload = {
            full_name: this.fullNameTarget.value,
            email: this.emailTarget.value,
            phone: this.phoneTarget.value,
            role
        };

        try {
            const res = await fetch(`/api/v1/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            Toast.show({ message: `${role} created successfully` });

            setTimeout(() => {
                window.location.href = `/${role}s`;
            }, 1000);

        } catch (err) {
            Toast.show({ message: err.message });
        }
    }

    renderShowPage(data, role) {
        this.fullNameTarget.textContent = data.full_name;
        this.emailTarget.textContent = data.email;
        this.phoneTarget.textContent = data.phone || "N/A";
        this.roleTarget.textContent = role;
        this.createdAtTarget.textContent = new Date(data.created_at).toLocaleString();

        this.editBtnTarget.href = `/${role}/${data.id}/edit`;
    }
}