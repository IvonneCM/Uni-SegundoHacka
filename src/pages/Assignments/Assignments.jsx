import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { professorApi } from "../../lib/professorApi";

import s from "./Assignments.module.css";

const LANGS = [
  "javascript",
  "python",
  "java",
  "c",
  "cpp",
  "typescript",
  "go",
  "rust",
];

export default function Assignments() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "javascript",
    deadline: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isProfOrAdmin =
    user?.role === "professor" || user?.role === "admin";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await professorApi.getAssignments();

      setAssignments(Array.isArray(data) ? data : data.assignments || []);
    } catch (error) {
      console.error("Error cargando tareas:", error);
      setError("No se pudieron cargar las tareas.");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.deadline) {
      setError("Título y fecha límite son requeridos");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title,
        description: form.description,
        language: form.language,
        deadline: form.deadline,
        professor_id: user.id,
      };

      await professorApi.createAssignment(payload);

      setShowForm(false);

      setForm({
        title: "",
        description: "",
        language: "javascript",
        deadline: "",
      });

      await load();
    } catch (error) {
      console.error("Error creando tarea:", error);
      setError(error.message || "No se pudo crear la tarea.");
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) > new Date();
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Tareas</h1>
          <p className={s.sub}>Asignaciones de programación</p>
        </div>

        {isProfOrAdmin && (
          <button
            className={s.createBtn}
            onClick={() => setShowForm((prev) => !prev)}
            type="button"
          >
            {showForm ? "✕ Cancelar" : "+ Nueva tarea"}
          </button>
        )}
      </div>

      {showForm && (
        <div className={s.formCard}>
          <h2 className={s.formTitle}>Crear asignación</h2>

          <div className={s.formGrid}>
            <div className={s.field}>
              <label>Título *</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ej: Algoritmos de ordenamiento"
              />
            </div>

            <div className={s.field}>
              <label>Lenguaje</label>
              <select
                value={form.language}
                onChange={(e) => set("language", e.target.value)}
              >
                {LANGS.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${s.field} ${s.fullWidth}`}>
              <label>Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Descripción del problema..."
              />
            </div>

            <div className={s.field}>
              <label>Fecha límite *</label>
              <input
                type="datetime-local"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
          </div>

          {error && <p className={s.error}>{error}</p>}

          <div className={s.formActions}>
            <button
              className={s.saveBtn}
              onClick={handleCreate}
              disabled={saving}
              type="button"
            >
              {saving ? "Guardando..." : "Crear tarea"}
            </button>
          </div>
        </div>
      )}

      {!showForm && error && <p className={s.error}>{error}</p>}

      {loading ? (
        <p className={s.muted}>Cargando tareas...</p>
      ) : assignments.length === 0 ? (
        <p className={s.muted}>No hay tareas disponibles.</p>
      ) : (
        <div className={s.grid}>
          {assignments.map((assignment) => {
            const active = isActive(assignment.deadline);

            return (
              <div
                key={assignment.id}
                className={`${s.card} ${!active ? s.expired : ""}`}
              >
                <div className={s.cardTop}>
                  <span
                    className={`${s.langTag} ${
                      s[assignment.language] || ""
                    }`}
                  >
                    {assignment.language}
                  </span>

                  <span className={active ? s.active : s.expiredTag}>
                    {active ? "● Activa" : "○ Vencida"}
                  </span>
                </div>

                <h3 className={s.cardTitle}>{assignment.title}</h3>

                <p className={s.cardDesc}>
                  {assignment.description || "Sin descripción."}
                </p>

                <div className={s.cardFooter}>
                  <span className={s.deadline}>
                    ⏱ {fmtDate(assignment.deadline)}
                  </span>

                  {user?.role === "student" && active && (
                    <Link
                      to={`/assignments/${assignment.id}/submit`}
                      className={s.submitBtn}
                    >
                      Enviar código →
                    </Link>
                  )}

                  {isProfOrAdmin && (
                    <Link
                      to={`/submissions?assignment_id=${assignment.id}`}
                      className={s.viewBtn}
                    >
                      Ver entregas →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}