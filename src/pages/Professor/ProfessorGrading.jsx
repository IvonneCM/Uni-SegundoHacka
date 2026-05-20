import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiArrowLeft, FiCheckCircle, FiPlay, FiSave } from "react-icons/fi";
import { professorApi } from "../../lib/professorApi";
import { useAuth } from "../../lib/auth";
import s from "./Professor.module.css";

export default function ProfessorGrading() {
  const { submissionId } = useParams();
  const { user } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [executionLog, setExecutionLog] = useState("Esperando ejecución...");

  const [criteria, setCriteria] = useState([
    { id: 1, name: "Correctitud", description: "Salida esperada correcta.", maxScore: 50, score: 40 },
    { id: 2, name: "Uso de estructuras", description: "Uso adecuado de ciclos, condiciones o funciones.", maxScore: 30, score: 25 },
    { id: 3, name: "Buenas prácticas", description: "Código claro y ordenado.", maxScore: 20, score: 15 },
  ]);

  useEffect(() => {
    professorApi
      .getSubmissionForGrading(submissionId)
      .then(setSubmission)
      .catch((error) => Swal.fire("Error", error.message, "error"));
  }, [submissionId]);

  const totalScore = useMemo(
    () => criteria.reduce((acc, c) => acc + Number(c.score || 0), 0),
    [criteria]
  );

  const maxScore = useMemo(
    () => criteria.reduce((acc, c) => acc + Number(c.maxScore || 0), 0),
    [criteria]
  );

  const updateScore = (id, value) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, score: Math.min(Number(value), c.maxScore) } : c
      )
    );
  };

  const handleRun = () => {
    setExecutionLog(
      `Compilación correcta.
Lenguaje: ${submission?.language}
Ejecución finalizada.
Pruebas simuladas superadas.
Nota preliminar: ${totalScore}/${maxScore}.`
    );

    Swal.fire("Ejecución completada", "El código fue ejecutado correctamente.", "success");
  };

  const handleSave = async () => {
    try {
      await professorApi.updateSubmissionStatus(submissionId, "graded", user?.id);

      Swal.fire(
        "Calificación registrada",
        `La nota final es ${totalScore}/${maxScore}. El envío fue marcado como graded.`,
        "success"
      );
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  if (!submission) {
    return <div className={s.loading}>Cargando envío...</div>;
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <Link to={`/professor/assignments/${submission.assignment_id}`} className={s.backBtn}>
            <FiArrowLeft /> Volver a la tarea
          </Link>

          <span className={s.kicker}>Grading Service</span>
          <h1>Calificación automática</h1>
          <p>Evaluación del código enviado por el estudiante.</p>
        </div>

        <button className={s.primaryBtn} onClick={handleSave}>
          <FiSave /> Guardar nota
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
            <span>Intento</span>
            <strong>#{submission.attempt_number}</strong>
          </div>
        </div>
      </section>

      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statIcon}><FiCheckCircle /></div>
          <div>
            <span>Nota final</span>
            <strong>{totalScore}/{maxScore}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}><FiPlay /></div>
          <div>
            <span>Estado</span>
            <strong>{submission.status}</strong>
          </div>
        </div>
      </div>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Criterios de calificación</h2>
            <p>Definidos por el profesor para calcular la nota.</p>
          </div>

          <button className={s.secondaryBtn} onClick={handleRun}>
            <FiPlay /> Ejecutar
          </button>
        </div>

        <div className={s.criteriaList}>
          {criteria.map((criterion) => (
            <div className={s.criteriaCard} key={criterion.id}>
              <div>
                <strong>{criterion.name}</strong>
                <p>{criterion.description}</p>
                <small>Máximo: {criterion.maxScore} pts</small>
              </div>

              <input
                type="number"
                min="0"
                max={criterion.maxScore}
                value={criterion.score}
                onChange={(e) => updateScore(criterion.id, e.target.value)}
              />
            </div>
          ))}
        </div>
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
            <h2>Logs de ejecución</h2>
            <p>Registro auditable de ejecución simulada.</p>
          </div>
        </div>

        <pre className={s.logBox}>{executionLog}</pre>
      </section>
    </div>
  );
}