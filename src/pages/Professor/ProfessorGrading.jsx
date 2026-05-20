import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiPlay,
  FiSave,
  FiEdit3,
  FiList,
} from "react-icons/fi";
import { professorApi } from "../../lib/professorApi";
import { useAuth } from "../../lib/auth";
import s from "./Professor.module.css";

export default function ProfessorGrading() {
  const { submissionId } = useParams();
  const { user } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [gradingResult, setGradingResult] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [manualScore, setManualScore] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [submissionId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const sub = await professorApi.getSubmissionForGrading(submissionId);
      setSubmission(sub);

      try {
        const result = await professorApi.getGradingBySubmission(submissionId);
        setGradingResult(result);
        setManualScore(result.final_score || "");
      } catch {
        setGradingResult(null);
        setManualScore("");
      }

      const attemptList = await professorApi.getStudentAttemptsWithGrades(
        sub.assignment_id,
        sub.student_id
      );

      setAttempts(attemptList);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGrade = async () => {
    try {
      const result = await professorApi.gradeSubmission(submissionId);
      setGradingResult(result);
      setManualScore(result.final_score || "");

      Swal.fire(
        "Calificación generada",
        `Nota final: ${result.final_score || 0}/100`,
        "success"
      );

      loadData();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleManualSave = async () => {
    if (manualScore === "" || Number(manualScore) < 0 || Number(manualScore) > 100) {
      Swal.fire("Nota inválida", "La nota debe estar entre 0 y 100.", "warning");
      return;
    }

    try {
      const result = await professorApi.updateGradeManually(submissionId, {
        final_score: Number(manualScore),
        user_id: user?.id,
        reason: reason || "Ajuste manual realizado por el profesor.",
      });

      setGradingResult(result);

      Swal.fire(
        "Nota actualizada",
        `La nota fue cambiada a ${result.final_score}/100.`,
        "success"
      );

      loadData();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading) return <div className={s.loading}>Cargando envío...</div>;
  if (!submission) return <div className={s.loading}>No se encontró el envío.</div>;

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <div>
          <Link
            to={`/professor/assignments/${submission.assignment_id}`}
            className={s.backBtn}
          >
            <FiArrowLeft /> Volver a la tarea
          </Link>

          <span className={s.kicker}>Grading Service</span>
          <h1>Calificación del envío</h1>
          <p>Califica automáticamente o ajusta manualmente la nota del estudiante.</p>
        </div>

        <button className={s.primaryBtn} onClick={handleAutoGrade}>
          <FiPlay /> Calificar automático
        </button>
      </div>

      <section className={s.section}>
        <div className={s.infoGrid}>
          <div>
            <span>Tarea</span>
            <strong>{submission.assignment_title}</strong>
          </div>
          <div>
            <span>Estudiante</span>
            <strong>{submission.student_name}</strong>
          </div>
          <div>
            <span>Intento actual</span>
            <strong>#{submission.attempt_number}</strong>
          </div>
        </div>
      </section>

      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiCheckCircle />
          </div>
          <div>
            <span>Nota actual</span>
            <strong>{gradingResult?.final_score ?? "—"}/100</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiPlay />
          </div>
          <div>
            <span>Estado</span>
            <strong>{gradingResult?.execution_status || "pendiente"}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiList />
          </div>
          <div>
            <span>Intentos</span>
            <strong>{attempts.length}</strong>
          </div>
        </div>
      </div>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2><FiEdit3 /> Cambiar nota manualmente</h2>
            <p>Permite corregir la nota final manteniendo auditoría.</p>
          </div>

          <button className={s.secondaryBtn} onClick={handleManualSave}>
            <FiSave /> Guardar nota manual
          </button>
        </div>

        <div className={s.manualGradeGrid}>
          <div className={s.field}>
            <label>Nota final sobre 100</label>
            <input
              type="number"
              min="0"
              max="100"
              value={manualScore}
              onChange={(e) => setManualScore(e.target.value)}
              placeholder="Ej: 85"
            />
          </div>

          <div className={s.field}>
            <label>Motivo del ajuste</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: corrección manual por revisión del profesor"
            />
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Intentos del estudiante</h2>
            <p>Historial de intentos para esta tarea con sus notas.</p>
          </div>
        </div>

        {attempts.length === 0 ? (
          <p className={s.empty}>No hay intentos registrados.</p>
        ) : (
          <div className={s.table}>
            <div className={s.tableHeaderAttempts}>
              <span>Intento</span>
              <span>Estado envío</span>
              <span>Nota</span>
              <span>Estado ejecución</span>
              <span>Enviado</span>
              <span>Calificado</span>
            </div>

            {attempts.map((item) => (
              <div key={item.submission_id} className={s.tableRowAttempts}>
                <span>#{item.attempt_number}</span>
                <span>{item.status}</span>
                <span>{item.final_score ?? "—"}/100</span>
                <span>{item.execution_status || "pendiente"}</span>
                <span>{formatDate(item.submitted_at)}</span>
                <span>{formatDate(item.graded_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Código fuente enviado</h2>
            <p>Código recuperado desde Submission Service.</p>
          </div>
        </div>

        <pre className={s.logBox}>{submission.source_code}</pre>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Resultado de ejecución</h2>
            <p>Respuesta generada por Grading Service.</p>
          </div>
        </div>

        <pre className={s.logBox}>
{gradingResult
  ? `Salida: ${gradingResult.execution_output || "—"}
Logs: ${gradingResult.execution_logs || "—"}
Fecha: ${formatDate(gradingResult.graded_at)}`
  : "Este envío todavía no fue calificado."}
        </pre>
      </section>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}