import "./Settings.css";

import { useEffect, useState } from "react";
import { store } from "@telemetryos/sdk";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export function Settings() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const subscribeTodosEffect = () => {
    console.log("Subscribing to todos in store...");
    store()
      .application.subscribe("todos", (value) => {
        console.log("Received todos update from store:", value);
        if (value && Array.isArray(value)) {
          setTodos(value);
        } else if (value === null || value === undefined) {
          console.log("No todos found in store, initializing empty list.");
          setTodos([]);
          store().application.set("todos", []).catch(console.error);
        }
        console.log("Todos state updated:", todos);
        setIsLoading(false);
      })
      .catch(console.error);
  };

  useEffect(subscribeTodosEffect, []);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!todoText.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: todoText,
      completed: false,
      createdAt: Date.now(),
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    store().application.set("todos", updatedTodos).catch(console.error);
    setTodoText("");
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    store().application.set("todos", updatedTodos).catch(console.error);
  };

  return (
    <div className="settings">
      <h2>Manage Todos</h2>
      <form onSubmit={handleAddTodo} className="form-field">
        <div className="form-field-label">Add New Todo</div>
        <div className="form-field-frame">
          <input
            className="form-field-input"
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            disabled={isLoading}
            placeholder="Enter todo text..."
          />
        </div>
        <button
          type="submit"
          className="form-field-button"
          disabled={isLoading || !todoText.trim()}
        >
          Add Todo
        </button>
      </form>

      <div className="settings__todo-list">
        <h3>Current Todos ({todos.length})</h3>
        {todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          <ul className="settings__todos">
            {todos.map((todo) => (
              <li key={todo.id} className="settings__todo-item">
                <span
                  className={
                    todo.completed
                      ? "settings__todo-text--completed"
                      : "settings__todo-text"
                  }
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="settings__delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
