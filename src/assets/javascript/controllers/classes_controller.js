//javascript/controllers/admin/classes/index_controller.js
import { ApplicationController } from "./applicationController.js";
import { TableComponent } from "../core/tableComponent.js";
import { Toast } from "../core/toast.js";
import { Auth } from "../core/auth.js";

export default class ClassesController extends ApplicationController {


    static targets = [
        "form",
        "name",
        "displayName",
        "gradeLevel",
        "description",
        "createdAt",
        "editBtn"
    ];

    connect() {
        this.isAdmin = Auth.hasRole("admin");

        this.columns = [
            { key: "display_name", label: "Title" },
            { key: "name", label: "Subtitle" },
            { key: "description", label: "Description" },
            { key: "grade_level", label: "Grade Level" },
            { key: "created_at", label: "Created At" },
        ];
    }

    // 📄 INDEX PAGE
    async index() {
        const res = await fetch(`/api/v1/grades`);
        const result = await res.json();

        this.renderTable(result.data);
    }

    // ➕ NEW PAGE
    new() {
        console.log("New form loaded");

        if (!this.hasFormTarget) return;

        this.formTarget.addEventListener("submit", this.handleSubmit.bind(this));
    }

    async edit() {
        const id = this.getIdFromURL();

        try {
            const res = await fetch(`/api/v1/grades/${id}`);
            const result = await res.json();

            if (!res.ok) throw new Error(result.message);

            const data = result.data;

            // 🔥 Prefill form safely
            this.displayNameTarget.value = data.display_name || "";
            this.nameTarget.value = data.name || "";
            this.gradeLevelTarget.value = data.grade_level || "";
            this.descriptionTarget.value = data.description || "";

            this.formTarget.addEventListener("submit", (e) => this.update(e, id));

        } catch (err) {
            console.log(err);

            Toast.show({
                message: "Failed to load class",
                duration: 2000
            });
        }
    }

    // 🔥 SHARED TABLE RENDER
    renderTable(data) {
        if (!this.hasClassesListTarget) return;

        this.table = new TableComponent({
            element: this.classesListTarget,
            columns: this.columns,
            data
        });

        this.attachActions();

        this.table.render();
    }

    // 🔥 ACTIONS (REUSABLE)
    attachActions() {
        this.table.onView = (item) => {
            window.location.href = `/classes/${item.id}`;
        };

        this.table.onEdit = (item) => {
            if (!this.isAdmin) return this.noAccess();
            window.location.href = `/classes/${item.id}/edit`;
        };

        this.table.onDelete = (item) => {
            if (!this.isAdmin) return this.noAccess();
            this.deleteItem(item);
        };
    }

    // 🔥 DELETE LOGIC
    deleteItem(item) {
        const originalData = [...this.table.fullData];

        this.table.updateData(originalData.filter(u => u.id !== item.id));

        let undone = false;

        Toast.show({
            message: `${item.display_name} deleted`,
            actionText: "Undo",
            onAction: () => {
                undone = true;
                this.table.updateData(originalData);
            }
        });

        setTimeout(async () => {
            if (undone) return;

            await fetch(`/api/v1/grades/${item.id}?_method=DELETE`, {
                method: "POST"
            });

            this.index(); // reload
        }, 5000);
    }

    noAccess() {
        Toast.show({
            message: "No permission",
            duration: 1500
        });
    }

    getIdFromURL() {
        const parts = window.location.pathname.split("/").filter(Boolean);

        // if URL ends with "edit", get previous part
        if (parts[parts.length - 1] === "edit") {
            return parts[parts.length - 2];
        }

        return parts[parts.length - 1];
    }

    async update(e, id) {
    e.preventDefault();

    const payload = {
        name: this.nameTarget.value,
        display_name: this.displayNameTarget.value,
        grade_level: this.gradeLevelTarget.value,
        description: this.descriptionTarget.value || null
    };

    try {
        const res = await fetch(`/api/v1/grades/${id}?_method=PATCH`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        Toast.show({ message: result.message });

        setTimeout(() => {
            window.location.href = `/classes/${id}`;
        }, 1000);

    } catch (err) {
        Toast.show({
            message: err.message || "Update failed",
            duration: 2000
        });
    }
}

    async show() {
        const id = this.getIdFromURL();

        const res = await fetch(`/api/v1/grades/${id}`);
        const result = await res.json();

        const data = result.data;

        // 🔥 Populate UI
        this.displayNameTarget.textContent = data.display_name;
        this.nameTarget.textContent = data.name;
        this.gradeLevelTarget.textContent = `Grade ${data.grade_level}`;
        this.descriptionTarget.textContent = data.description || "No description";
        this.createdAtTarget.textContent = new Date(data.created_at).toLocaleString();

        // 🔥 Edit button link
        if (this.hasEditBtnTarget) {
            this.editBtnTarget.href = `/classes/${id}/edit`;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const payload = {
            name: this.nameTarget.value,
            display_name: this.displayNameTarget.value,
            grade_level: this.gradeLevelTarget.value,
            description: this.descriptionTarget.value || null
        };

        try {
            const res = await fetch("/api/v1/grades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            console.log(result)
            if (!res.ok) throw new Error(result.message);

            Toast.show({
                message: result.message
            });

            // redirect after success
            setTimeout(() => {
                window.location.href = "/classes/" + result.id;
            }, 1000);

        } catch (err) {
            console.log(err);

            Toast.show({
                message: err.message || "Something went wrong",
                duration: 2000
            });
        }
    }
}