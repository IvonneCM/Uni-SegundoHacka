import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPlus, FiCalendar, FiFileText } from "react-icons/fi";
import { useAuth } from "../../lib/auth";
import { professorApi } from "../../lib/professorApi";
import s from "./Professor.module.css";

export default function ProfessorAssignments() {
  const { user } = useAuth();
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
    try {
      setAssignments(await professorApi.getAssignments());
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire("Error", "No se encontró el ID del profesor logueado.", "error");
      return;
    }

    if (!form.title || !form.deadline) {
      Swal.fire("Campos incompletos", "Título y fecha límite son obligatorios.", "warning");
      return;
    }

    try {
      await professorApi.createAssignment({ ...form, professor_id: user.id });
      Swal.fire("Tarea creada", "La tarea fue registrada correctamente.", "success");

      setForm({
        title: "",
        description: "",
        language: "javascript",
        deadline: "",
      });

      loadAssignments();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <span className={s.kicker}>Submission Service</span>
        <h1>Gestión de tareas</h1>
        <p>Crear tareas, definir fecha límite y revisar entregas.</p>
      </div>

      <div className={s.layout}>
        <form className={s.formCard} onSubmit={handleCreate}>
          <h2><FiPlus /> Nueva tarea</h2>

          <div className={s.field}>
            <label>Título</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className={s.field}>
            <label>Lenguaje</label>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="javascript">javascript</option>
              <option value="python">python</option>
              <option value="java">java</option>
              <option value="c">c</option>
              <option value="cpp">cpp</option>
            </select>
          </div>

          <div className={s.field}>
            <label><FiCalendar /> Fecha límite</label>
            <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>

          <div className={s.field}>
            <label><FiFileText /> Descripción</label>
            <textarea rows="6" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <button className={s.primaryBtn}>Crear tarea</button>
        </form>

        <div className={s.listCard}>
          <h2>Tareas registradas</h2>

          <div className={s.cardGrid}>
            {assignments.map((a) => (
              <Link key={a.id} to={`/professor/assignments/${a.id}`} className={s.assignmentCard}>
                <span className={s.languageBadge}>{a.language}</span>
                <h3>{a.title}</h3>
                <p>{a.description || "Sin descripción"}</p>
                <small>Fecha límite: {formatDate(a.deadline)}</small>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-BO");
}