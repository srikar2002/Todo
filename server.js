const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

const TODOS_FILE = path.join(__dirname, "todos.json");

app.use(express.static("public"));
app.use(express.json());

// Utility: Read todos from file
function readTodos() {
  try {
    const data = fs.readFileSync(TODOS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Utility: Write todos to file
function writeTodos(todos) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
}

// GET all todos
app.get("/api/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST new todo
app.post("/api/todos", (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT update todo
app.put("/api/todos/:id", (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).send("Not found");
  todo.completed = req.body.completed;
  writeTodos(todos);
  res.json(todo);
});

// DELETE todo
app.delete("/api/todos/:id", (req, res) => {
  let todos = readTodos();
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  writeTodos(todos);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
