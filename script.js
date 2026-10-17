
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const list = document.getElementById("todo-list");
    const count = document.getElementById("task-count");
    const emptyState = document.getElementById("empty-state");
    const message = document.getElementById("message");

    // Load saved tasks from the browser
    let tasks = [];

    try {
        const savedTasks = JSON.parse(localStorage.getItem("myTodoTasks"));
        if (Array.isArray(savedTasks)) {
            tasks = savedTasks.filter(task =>
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            ).map(task => ({
                id: task.id ?? (Date.now() + Math.random()),
                text: task.text,
                completed: task.completed
            }));
        }
    } catch (error) {
        tasks = [];
    }

    function saveTasks() {
        localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        list.innerHTML = "";

        const remaining = tasks.filter(task => !task.completed).length;
        count.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
        emptyState.hidden = tasks.length > 0;

        tasks.forEach(task => {
            const item = document.createElement("li");
            item.className = "todo-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "todo-checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", `Complete ${task.text}`);

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const text = document.createElement("span");
            text.className = "todo-text";
            text.textContent = task.text;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

            deleteButton.addEventListener("click", () => {
                tasks = tasks.filter(currentTask => currentTask.id !== task.id);
                saveTasks();
                renderTasks();
            });

            item.append(checkbox, text, deleteButton);
            list.appendChild(item);
        });
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const text = input.value.trim();

        if (!text) {
            message.textContent = "Please enter a task first.";
            input.focus();
            return;
        }

        tasks.push({
            id: Date.now() + Math.random(),
            text,
            completed: false
        });

        saveTasks();
        message.textContent = "";
        form.reset();
        input.focus();
        renderTasks();
    });

    input.addEventListener("input", () => {
        message.textContent = "";
    });

    renderTasks();
});
