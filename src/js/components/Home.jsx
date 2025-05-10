import React, { useEffect, useState } from "react";

const USERNAME = "RCKCode"; 

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {

    fetch(`https://playground.4geeks.com/todo/users/${RCKCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) {
          console.log("El usuario ya existe o hubo un error.");
        }
        return res.json();
      })
      .then(() => fetchTasks())
      .catch((err) => console.error("Error al crear usuario:", err));
  }, []);

  const fetchTasks = () => {
    fetch(`https://playground.4geeks.com/todo/todos/${RCKCode}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error al cargar tareas:", err));
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = {
        label: inputValue.trim(),
        is_done: false
      };
      try {
        await fetch(`https://playground.4geeks.com/todo/todos/${RCKCode}`, {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-Type": "application/json"
          }
        });
        setInputValue("");
        fetchTasks();
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    }
  };

  const removeTask = async (id) => {
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${RCKCode}/${id}`, {
        method: "DELETE"
      });
      fetchTasks();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  const clearAllTasks = async () => {
    try {
      await Promise.all(
        tasks.map((task) =>
          fetch(`https://playground.4geeks.com/todo/todos/${RCKCode}/${task.id}`, {
            method: "DELETE"
          })
        )
      );
      fetchTasks();
    } catch (err) {
      console.error("Error al borrar todas las tareas:", err);
    }
  };

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
                  <button className="btn btn-danger btn-sm mt-2" onClick={clearAllTasks}>
                    Borrar todas
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