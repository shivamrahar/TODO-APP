import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const TodoForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTodo) {
        // If there is a selected todo, perform update operation
        await axios.put(`http://localhost:4000/update/${selectedTodo._id}`, {
          name,
          description,
          status,
        });

        // Find the updated todo and replace it in the list
        const updatedTodos = todos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return { ...todo, name, description, status };
          }
          return todo;
        });

        setTodos(updatedTodos);
        setSelectedTodo(null); // Clear the selected todo
      } else {
        // Perform add operation
        const response = await axios.post('http://localhost:4000/add', {
          name,
          description,
          status,
        });

        const newTodo = response.data;
        setTodos([...todos, newTodo]);
      }

      setName('');
      setDescription('');
      setStatus('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:4000/delete/${taskId}`);

      const updatedTodos = todos.filter((todo) => todo._id !== taskId);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setName(todo.name);
    setDescription(todo.description);
    setStatus(todo.status);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/get');
      const fetchedTasks = response.data;
      setTodos(fetchedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
      <form className="TodoForm" onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todo-input"
          placeholder="What is the task today?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="todo-input"
          placeholder="Description?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="todo-input"
          placeholder="Status?"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button type="submit" className="todo-btn">
          {selectedTodo ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      <button type="button" className="todo-btn" onClick={fetchTasks}>
        Show All Tasks
      </button>

      <h2 style={{ color: 'white', marginBottom: '10px' }}>Todos List</h2>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <div className="Todo">
              <p>{todo.name}</p>
              <p>{todo.description}</p>
              <span>{todo.status}</span>
              <div>
                <FontAwesomeIcon
                  icon={faPenSquare}
                  className="fapen"
                  onClick={() => handleEdit(todo)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleDelete(todo._id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default TodoForm;
