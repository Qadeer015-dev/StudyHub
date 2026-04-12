import { ApplicationController } from "./applicationController.js";

export default class LoginController extends ApplicationController {
    connect() {
        console.log("Logout connected");
    }

    async submit(event) {
        event.preventDefault();
        try {
            const res = await fetch(`/api/v1/auth/logout?_method=DELETE`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            window.location.href = "/";
        } catch (err) {
            console.log("logoutError", err.message);
        }
    }
}