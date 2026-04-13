import { ApplicationController } from "./applicationController.js";

export default class LoginController extends ApplicationController {
    connect() {
        console.log("Login connected");
    }

    async submit(event) {
        event.preventDefault();
        const password = this.targets.password[0].value;
        const email = this.targets.email[0].value;

        const data = {
            email,
            password,
            reqSource:'web'
        };

        try {
            const res = await fetch(`/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            window.location.href = "/";
        } catch (err) {
            this.showError("loginError", err.message);
        }
    }

    showError(targetName, message) {
        const el = this.targets[targetName][0];
        el.textContent = message;
        el.classList.remove("d-none");
    }
}