import { ApplicationController } from "./applicationController.js";

export default class RegisterController extends ApplicationController {

    connect() {
        console.log("✅ Register connected");

        this.API_BASE = "/api/v1";
        this.academyId = null;

        this.showStep(1);
    }

    // 🔥 STEP SWITCHING
    showStep(step) {
        this.targets.step1[0].style.display = step === 1 ? "block" : "none";
        this.targets.step2[0].style.display = step === 2 ? "block" : "none";

        this.targets.step1Indicator[0].classList.toggle("text-muted", step !== 1);
        this.targets.step2Indicator[0].classList.toggle("text-muted", step !== 2);
    }

    // 🔥 STEP 1 SUBMIT
    async submitAcademy(e) {
        e.preventDefault();

        const data = {
            name: this.targets.academyName[0].value.trim(),
            academy_email: this.targets.academyEmail[0].value.trim(),
            street: this.targets.street[0].value.trim(),
            city: this.targets.city[0].value.trim(),
            state: this.targets.state[0].value.trim(),
            postal_code: this.targets.postalCode[0].value.trim(),
            country: this.targets.country[0].value.trim(),
            website: this.targets.website[0].value.trim() || null
        };

        try {
            const res = await fetch(`${this.API_BASE}/academies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            this.academyId = result.data.id;

            // autofill admin email
            this.targets.adminEmail[0].value = data.academy_email;

            this.showStep(2);

        } catch (err) {
            this.showError("academyError", err.message);
        }
    }

    // 🔥 STEP 2 SUBMIT
    async submitAdmin(e) {
        e.preventDefault();

        const password = this.targets.password[0].value;
        const confirm = this.targets.confirmPassword[0].value;

        if (password !== confirm) {
            return this.showError("adminError", "Passwords do not match");
        }

        const data = {
            full_name: this.targets.adminName[0].value.trim(),
            email: this.targets.adminEmail[0].value.trim(),
            phone: this.targets.adminPhone[0].value.trim() || null,
            password,
            role: "admin",
            academy_id: this.academyId
        };

        try {
            const res = await fetch(`${this.API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));

            window.location.href = "/";

        } catch (err) {
            this.showError("adminError", err.message);
        }
    }

    // 🔥 BACK BUTTON
    back() {
        this.showStep(1);
    }

    showError(targetName, message) {
        const el = this.targets[targetName][0];
        el.textContent = message;
        el.classList.remove("d-none");
    }
}