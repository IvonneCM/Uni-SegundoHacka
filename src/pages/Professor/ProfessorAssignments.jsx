import { useEffect, useState } from "react";

import Swal from "sweetalert2";

import {
  FiPlus,
  FiCalendar,
  FiCode,
  FiFileText,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import { professorApi } from "../../lib/professorApi";

import s from "./Professor.module.css";

export default function ProfessorAssignments() {
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "javascript",
    deadline: "",
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const data = await professorApi.getAssignments();
    setAssignments(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await professorApi.createAssignment({
        ...form,
        professor_id: "4ea3e7d8-2fad-4dca-b70d-xxxx",
      });

      Swal.fire({
        icon: "success",
        title: "Tarea creada",
        text: "La tarea fue registrada correctamente.",
      });

      setForm({
        title: "",
        description: "",
        language: "javascript",
        deadline: "",
      });

      loadAssignments();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1>Gestión de tareas</h1>
          <p>
            Crear tareas, definir fechas límite y revisar entregas.
          </p>
        </div>
      </div>

      <div className={s.layout}>
        <form className={s.formCard} onSubmit={handleCreate}>
          <h2>
            <FiPlus />
            Nueva tarea
          </h2>

          <div className={s.field}>
            <label>Título</label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className={s.field}>
            <label>Lenguaje</label>

            <select
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value })
              }
            >
              <option>javascript</option>
              <option>python</option>
              <option>java</option>
              <option>c</option>
              <option>cpp</option>
            </select>
          </div>

          <div className={s.field}>
            <label>
              <FiCalendar />
              Fecha límite
            </label>

            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
            />
          </div>

          <div className={s.field}>
            <label>
              <FiFileText />
              Descripción
            </label>

            <textarea
              rows="6"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <button className={s.primaryBtn}>
            Crear tarea
          </button>
        </form>

        <div className={s.listCard}>
          <h2>Tareas registradas</h2>

          <div className={s.cardGrid}>
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/professor/assignments/${assignment.id}`}
                className={s.assignmentCard}
              >
                <div className={s.assignmentTop}>
                  <span className={s.languageBadge}>
                    {assignment.language}
                  </span>
                </div>

                <h3>{assignment.title}</h3>

                <p>{assignment.description}</p>

                <small>
                  Fecha límite:
                  {" "}
                  {formatDate(assignment.deadline)}
                </small>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleString("es-BO");
}