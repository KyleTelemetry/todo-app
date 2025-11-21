import './Render.css'
import { useEffect, useState } from 'react'
import { store } from '@telemetryos/sdk'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export function Render() {
  const [todos, setTodos] = useState<Todo[]>([])

  const subscribeTodosEffect = () => {
    store().application.subscribe('todos', (value) => {
      if (value && Array.isArray(value)) {
        setTodos(value)
      }
    }).catch(console.error)

    // Load initial todos
    store().application.get('todos').then((value) => {
      if (value && Array.isArray(value)) {
        setTodos(value)
      }
    }).catch(console.error)
  }
  useEffect(subscribeTodosEffect, [])

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    store().application.set('todos', updatedTodos).catch(console.error)
  }

  return (
    <div className="render">
      <div className="render__hero">
        <h1 className="render__hero-title">My Todo List</h1>
      </div>
      <div className="render__todo-list">
        {todos.length === 0 ? (
          <div className="render__empty-state">
            No todos yet. Go to Settings to create one!
          </div>
        ) : (
          <ul className="render__todos">
            {todos.map((todo) => (
              <li key={todo.id} className="render__todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="render__todo-checkbox"
                />
                <span className={todo.completed ? 'render__todo-text--completed' : 'render__todo-text'}>
                  {todo.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
