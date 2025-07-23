import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import axios from 'axios';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  // ✅ Your deployed Lambda API URL
  const API_URL = 'https://0ygb0enhte.execute-api.ap-south-1.amazonaws.com/default';

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        console.log('✅ Todos fetched:', res.data);
        setTodos(res.data);
      })
      .catch(err => console.error('❌ Fetch Error:', err));
  }, []);

  const addTodo = (task) => {
    axios.post(API_URL, { task })
      .then(res => setTodos([...todos, res.data]))
      .catch(err => console.error('❌ Add Error:', err));
  };

  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => setTodos(todos.filter(t => t._id !== id)))
      .catch(err => console.error('❌ Delete Error:', err));
  };

  const togglecomplete = (id) => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;
    axios.put(`${API_URL}/${id}`, { completed: !todo.completed })
      .then(res => setTodos(todos.map(t => t._id === id ? res.data : t)))
      .catch(err => console.error('❌ Toggle Complete Error:', err));
  };

  const editTodo = (id) => {
    setTodos(todos.map(t => t._id === id ? { ...t, isEditing: !t.isEditing } : t));
  };

  const editTask = (task, id) => {
    axios.put(`${API_URL}/${id}`, { task })
      .then(res => setTodos(todos.map(t => t._id === id ? { ...res.data, isEditing: false } : t)))
      .catch(err => console.error('❌ Edit Task Error:', err));
  };

  return (
    <div className="TodoWrapper">
      <h1>GET THINGS DONE!</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} key={todo._id} />
        ) : (
          <Todo
            task={todo}
            key={todo._id}
            togglecomplete={togglecomplete}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        )
      )}
    </div>
  );
};
