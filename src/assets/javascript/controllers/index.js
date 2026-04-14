//javascript/controllers/index.js
import { Framework } from "../core/framework.js";

const controllerFiles = [
    "./register_controller.js",
    "./login_controller.js",
    "./logout_controller.js",
    "./dashboard_controller.js",
    "./classes_controller.js",
    "./admin/user_management_controller.js"
];

const app = new Framework();

async function loadControllers() {
    for (const path of controllerFiles) {
        const module = await import(path);

        const name = path
            .split("/")
            .pop()
            .replace("_controller.js", "");

        app.register(name, module.default);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadControllers();   // ✅ wait here
    app.start();               // ✅ now controllers exist
});