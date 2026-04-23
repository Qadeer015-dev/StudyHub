import { ApplicationController } from "./applicationController.js";

export default class ForgotPasswordController extends ApplicationController {
    connect() {
        console.log("Forgot Password connected");
                const email = this.targets.email[0];
        console.log(`Email input found with value: ${email}`);
    }

    async submit(event) {
        event.preventDefault();
        const email = this.targets.email[0].value;
        console.log(`Submitting forgot password for email: ${email}`);


        try {
            const res = await fetch(`/api/v1/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
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