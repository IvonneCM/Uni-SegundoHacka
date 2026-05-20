import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiBook,
  FiUsers,
  FiClock,
  FiCode,
  FiCheckCircle,
  FiEye,
  FiAward,
  FiShield,
  FiDatabase,
} from "react-icons/fi";

import { professorApi } from "../../lib/professorApi";
import s from "./Professor.module.css";

export default function ProfessorAssignmentDetail() {
  const { id } = useParams();

  const [summary, setSummary] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const summaryData = await professorApi.getAssignmentSummary(id);
    const submissionsData = await professorApi.getSubmissionsByAssignment(id);

    setSummary(summaryData);
    setSubmissions(submissionsData);
  };

  if (!summary) {
    return <div className={s.loading}>Cargando detalle de la tarea...</div>;
  }

  const assignment = summary.assignment;
  const stats = summary.stats;

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <Link to="/professor/assignments" className={s.backBtn}>
            <FiArrowLeft />
            Volver a tareas
          </Link>

          <span className={s.kicker}>Detalle de tarea</span>
          <h1>{assignment.title}</h1>
          <p>{assignment.description || "Sin descripción registrada."}</p>
        </div>
      </div>

      <div className={s.statsGrid}>
        <div className={s.statCard}>
  <div className={s.statIcon}>
    <FiBook />
  </div>
  <div>
    <span>Estado</span>
    <strong>
      {assignment.assignment_status === "open" ? "Abierta" : "Cerrada"}
    </strong>
  </div>
</div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiUsers />
          </div>
          <div>
            <span>Estudiantes</span>
            <strong>{stats.total_students || 0}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiCode />
          </div>
          <div>
            <span>Entregas</span>
            <strong>{stats.total_submissions || 0}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiClock />
          </div>
          <div>
            <span>Máx. intentos</span>
            <strong>{stats.max_attempts || 0}</strong>
          </div>
        </div>
      </div>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Información académica</h2>
            <p>Datos que utiliza el Submission Service para validar envíos.</p>
          </div>
        </div>

        <div className={s.infoGrid}>
          <div>
            <span>Lenguaje requerido</span>
            <strong>{assignment.language}</strong>
          </div>

          <div>
            <span>Fecha límite</span>
            <strong>{formatDate(assignment.deadline)}</strong>
          </div>

          <div>
            <span>Última entrega</span>
            <strong>{formatDate(stats.last_submission_at)}</strong>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Criterios de calificación</h2>
            <p>Reglas que el profesor define para que Grading Service calcule la nota.</p>
          </div>
        </div>

        <div className={s.criteriaList}>
          {(summary.criteria || defaultCriteria).map((criterion) => (
            <div className={s.criteriaCard} key={criterion.id}>
              <div>
                <strong>{criterion.name}</strong>
                <p>{criterion.description}</p>
                <small>Puntaje máximo: {criterion.max_score || criterion.maxScore} pts</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Pruebas automáticas</h2>
            <p>Casos de prueba o métricas que se usarán para ejecutar el código.</p>
          </div>
        </div>

        <div className={s.testsList}>
          {(summary.test_cases || defaultTests).map((test) => (
            <div className={s.testCard} key={test.id}>
              <span className={s.languageBadge}>Test case</span>
              <p>
                <b>Entrada:</b> {test.input_data || test.input}
              </p>
              <p>
                <b>Salida esperada:</b> {test.expected_output || test.expected}
              </p>
              <small>Puntaje: {test.score} pts</small>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Entregas recibidas</h2>
            <p>
              Cada entrega puede enviarse a calificación, revisión de plagio y
              auditoría.
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <p className={s.empty}>No existen entregas todavía.</p>
        ) : (
          <div className={s.table}>
            <div className={s.tableHeader}>
              <span>Estudiante</span>
              <span>Email</span>
              <span>Intento</span>
              <span>Lenguaje</span>
              <span>Estado</span>
              <span>Fecha</span>
              <span>Acciones</span>
            </div>

            {submissions.map((submission) => (
              <div key={submission.id} className={s.tableRow}>
                <span>{submission.student_name || "—"}</span>
                <span>{submission.student_email || "—"}</span>
                <span>#{submission.attempt_number}</span>
                <span>{submission.language}</span>

                <span className={s.statusBadge}>
                  <FiCheckCircle />
                  {submission.status}
                </span>

                <span>{formatDate(submission.submitted_at)}</span>

                <div className={s.rowActions}>
                  <Link
                    to={`/professor/submissions/${submission.id}`}
                    className={s.viewBtn}
                  >
                    <FiEye />
                    Ver
                  </Link>

                  <Link
                    to={`/professor/grading/${submission.id}`}
                    className={s.gradeBtn}
                  >
                    <FiAward />
                    Calificar
                  </Link>

                  <button className={s.miniBtn} type="button">
                    <FiShield />
                    Plagio
                  </button>

                  <button className={s.miniBtn} type="button">
                    <FiDatabase />
                    LMS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const defaultCriteria = [
  {
    id: 1,
    name: "Correctitud",
    description: "El código debe producir la salida esperada según los casos de prueba.",
    maxScore: 50,
  },
  {
    id: 2,
    name: "Uso de estructuras",
    description: "Uso adecuado de ciclos, condicionales, funciones o estructuras requeridas.",
    maxScore: 30,
  },
  {
    id: 3,
    name: "Buenas prácticas",
    description: "Código legible, ordenado, entendible y con buena estructura.",
    maxScore: 20,
  },
];

const defaultTests = [
  {
    id: 1,
    input: "5",
    expected: "25",
    score: 25,
  },
  {
    id: 2,
    input: "10",
    expected: "100",
    score: 25,
  },
];

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