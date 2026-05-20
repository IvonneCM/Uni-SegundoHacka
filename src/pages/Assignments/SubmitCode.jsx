import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { professorApi } from "../../lib/professorApi";

import s from "./SubmitCode.module.css";

export default function SubmitCode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    try {
      const data = await professorApi.getAssignmentById(id);
      setAssignment(data);
    } catch (error) {
      console.error("Error cargando tarea:", error);
      setError("No se pudo cargar la tarea.");
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("El código no puede estar vacío");
      return;
    }

    const studentId =
      user?.id ||
      user?.userId ||
      user?.student_id ||
      user?.studentId;

    if (!studentId) {
      setError("No se encontró el ID del estudiante.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await professorApi.submitCode({
        assignment_id: id,
        student_id: studentId,
        source_code: code,
        language: assignment?.language || "javascript",
      });

      setSuccess(result);
    } catch (error) {
      console.error("Error enviando código:", error);
      setError(error.message || "No se pudo enviar el código.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={s.success}>
        <div className={s.successIcon}>✓</div>

        <h2>¡Código enviado!</h2>

        <p>
          Intento <strong>#{success.attempt_number}</strong> registrado
          correctamente.
        </p>

        <p className={s.muted}>
          El sistema podrá calificar automáticamente tu código desde Grading
          Service.
        </p>

        <div className={s.successActions}>
          <button
            onClick={() => navigate(`/submissions/${success.id}`)}
            className={s.viewBtn}
            type="button"
          >
            Ver resultado →
          </button>

          <button
            onClick={() => {
              setSuccess(null);
              setCode("");
            }}
            className={s.retryBtn}
            type="button"
          >
            Nuevo intento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={s.header}>
        <button
          className={s.back}
          onClick={() => navigate("/assignments")}
          type="button"
        >
          ← Tareas
        </button>

        {assignment && (
          <div className={s.assignInfo}>
            <h1 className={s.title}>{assignment.title}</h1>

            <p className={s.desc}>
              {assignment.description || "Sin descripción registrada."}
            </p>

            <div className={s.meta}>
              <span className={s.lang}>{assignment.language}</span>

              <span className={s.deadline}>
                Entrega: {new Date(assignment.deadline).toLocaleString("es-BO")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={s.editor}>
        <div className={s.editorHeader}>
          <span className={s.editorLabel}>
            <span className={s.dot} style={{ background: "#f87171" }} />
            <span className={s.dot} style={{ background: "#fbbf24" }} />
            <span className={s.dot} style={{ background: "#6ee7b7" }} />
            &nbsp; {assignment?.language || "código"}
          </span>

          <span className={s.lineCount}>{code.split("\n").length} líneas</span>
        </div>

        <textarea
          className={s.codeArea}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Escribe tu solución en ${
            assignment?.language || "código"
          } aquí\n\n`}
          spellCheck={false}
        />
      </div>

      {error && <p className={s.error}>{error}</p>}

      <div className={s.actions}>
        <span className={s.hint}>
          El Submission Service registrará tu intento.
        </span>

        <button
          className={s.submitBtn}
          onClick={handleSubmit}
          disabled={submitting || !code.trim()}
          type="button"
        >
          {submitting ? "Enviando..." : "Enviar código ↗"}
        </button>
      </div>
    </div>
  );
}