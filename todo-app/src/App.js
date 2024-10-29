import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddOrEditTask = () => {
    if (inputValue.trim()) {
      if (editIndex !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? inputValue.trim() : task
        );
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        setTasks([...tasks, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleEditTask = (index) => {
    setInputValue(tasks[index]);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // Check if dropped outside a droppable area

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks); // Update the tasks state with reordered tasks
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <button onClick={handleAddOrEditTask}>
          {editIndex !== null ? 'Edit' : 'Add'}
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul
              className="task-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={`task-${index}`} draggableId={`task-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '8px',
                        margin: '4px 0',
                        backgroundColor: snapshot.isDragging ? '#e0e4e7' : '#f4f4f4',
                        borderRadius: '4px',
                        boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                        transition: 'background-color 0.2s ease',
                        ...provided.draggableProps.style, // Ensure draggable styles are applied
                      }}
                    >
                      {task}
                      <button onClick={() => handleEditTask(index)}>Edit</button>
                      <button onClick={() => handleDeleteTask(index)}>Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder} {/* Keeps layout intact during drag */}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
