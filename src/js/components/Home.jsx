import React, { useState, useEffect } from "react";

const username = "RCKCode";
const API_URL = `https://playground.4geeks.com/todo/users/RICARDO`;
const API_post = `https://playground.4geeks.com/todo/todos/RICARDO`;
const API_dlt = `https://playground.4geeks.com/todo/todos`;

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");


  const loadTasks = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data.todos))
      .catch((err) => console.error("Error cargando tareas", err));
  };
  useEffect(() => {
      loadTasks()
  },[])


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = {
        label: inputValue.trim(),
        done: false,
      };
      fetch(API_post, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then(() => {
          setInputValue("");
          loadTasks(); // Refresca tareas desde el backend
        })
        .catch((err) => console.error("Error agregando tarea", err));
    }
  };

  // Eliminar una tarea específica
  const removeTask = (id) => {
    fetch(`${API_dlt}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => loadTasks())
      .catch((err) => console.error("Error eliminando tarea", err));
  };

  // Eliminar todas las tareas
  const clearAllTasks = () => {
    fetch(API_dlt, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => loadTasks())
      .catch((err) => console.error("Error limpiando tareas", err));
  }
  
//usar la url de eliminar usuario y luego volverlo a crear => apis de user

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Lista de Tareas</h1>
          <div className="card shadow">
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Añadir tarea..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <ul className="list-group">
                {tasks.length === 0 ? (
                  <li className="list-group-item text-muted">
                    No hay tareas, añadir tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <li
                      key={task.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {task.label}
                      <span
                        className="text-danger d-none delete-icon"
                        onClick={() => removeTask(task.id)}
                        role="button"
                        title="Eliminar tarea"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && removeTask(task.id)}
                      >
                        🗑️
                      </span>
                    </li>
                  ))
                )}
              </ul>

              {tasks.length > 0 && (
                <>
                  <small className="text-muted mt-2 d-block">
                    {tasks.length} tarea(s) pendiente(s)
                  </small>
                  <button
                    className="btn btn-danger btn-sm mt-3"
                    onClick={clearAllTasks}
                  >
                    Limpiar todas las tareas
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .list-group-item:hover .delete-icon {
            display: inline !important;
          }
        `}
      </style>
    </div>
  );
};

export default Home;