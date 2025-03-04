import React, { useState, useEffect } from "react";
import "./App.css";
const API_URL = "http://localhost:5000/tasks"; // Use env variable

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add a new task
  const addTask = () => {
    if (title.trim()) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
        .then((res) => res.json())
        .then((newTask) => setTasks([...tasks, newTask]))
        .catch((err) => console.error("Error adding task:", err));
      setTitle("");
    }
  };

  // Toggle task completion
  const toggleCompletion = (id, completed) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) =>
        setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)))
      )
      .catch((err) => console.error("Error updating task:", err));
  };

  // Delete a task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((err) => console.error("Error deleting task:", err));
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            {task.title}
            <button
              className="complete-btn"
              onClick={() => toggleCompletion(task._id, task.completed)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
