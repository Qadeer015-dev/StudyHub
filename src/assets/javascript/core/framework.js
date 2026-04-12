//javascript/core/framework.js
export class Framework {
    constructor() {
        this.controllers = {};
        this.instances = new WeakMap();
    }

    register(name, ControllerClass) {
        this.controllers[name] = ControllerClass;
    }

    start() {
        this.initDOM(document);

        // 🔥 Auto-detect DOM changes (AJAX / Turbo / dynamic UI)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        this.initDOM(node);
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        this.disconnectNode(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initDOM(root) {
        root.querySelectorAll?.("[data-controller]").forEach((el) => {
            if (this.instances.has(el)) return;

            const names = el.dataset.controller.split(" ");
            names.forEach((name) => {
                const ControllerClass = this.controllers[name];
                if (!ControllerClass) {
                    console.warn(`Controller "${name}" not found`);
                    return;
                }

                const controller = new ControllerClass(el);

                this.setup(controller, name);

                this.instances.set(el, controller);

                controller.connect?.();
            });
        });
    }

    setup(controller, name) {
        this.bindTargets(controller, name);
        this.bindValues(controller, name);
        this.bindActions(controller, name);
    }

    bindTargets(controller, name) {
        controller.targets = {};

        const elements = controller.element.querySelectorAll(`[data-target^="${name}."]`);

        elements.forEach((el) => {
            const targetName = el.dataset.target.split(".")[1];

            if (!controller.targets[targetName]) {
                controller.targets[targetName] = [];
            }

            controller.targets[targetName].push(el);
        });
    }

    bindValues(controller, name) {
        controller.values = {};

        Object.keys(controller.element.dataset).forEach((key) => {
            if (key.startsWith(name)) {
                const valueName = key.replace(name, "").toLowerCase();
                controller.values[valueName] = this.parseValue(controller.element.dataset[key]);
            }
        });
    }

    parseValue(value) {
        if (value === "true") return true;
        if (value === "false") return false;
        if (!isNaN(value)) return Number(value);
        return value;
    }

    bindActions(controller, name) {
        const elements = controller.element.querySelectorAll("[data-action]");

        elements.forEach((el) => {
            const actions = el.dataset.action.split(" ");

            actions.forEach((action) => {
                const [event, target] = action.split("->");
                const [controllerName, method] = target.split("#");

                if (controllerName === name && controller[method]) {
                    el.addEventListener(event, controller[method].bind(controller));
                }
            });
        });
    }

    disconnectNode(root) {
        root.querySelectorAll?.("[data-controller]").forEach((el) => {
            const controller = this.instances.get(el);

            if (controller?.disconnect) {
                controller.disconnect();
            }

            this.instances.delete(el);
        });
    }
}