const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

async function fetchTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  list.innerHTML = "";
  todos.forEach(addToDOM);
}

function addToDOM(todo) {
  const li = document.createElement("li");
  li.textContent = todo.text;
  if (todo.completed) li.classList.add("completed");

  li.addEventListener("click", async () => {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  });

  const del = document.createElement("button");
  del.innerHTML = '<i class="fas fa-trash-alt"></i>';

  del.onclick = async (e) => {
    e.stopPropagation();
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    fetchTodos();
  };

  li.appendChild(del);
  list.appendChild(li);
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  fetchTodos();
};

fetchTodos();

const deleteAllBtn = document.getElementById("delete-all-btn");

deleteAllBtn.addEventListener("click", async () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    await fetch("/api/todos", { method: "DELETE" });
    fetchTodos();
  }
});

