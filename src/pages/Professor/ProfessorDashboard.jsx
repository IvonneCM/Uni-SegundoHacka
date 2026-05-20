import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCode,
  FiArrowRight,
} from "react-icons/fi";
import { professorApi } from "../../lib/professorApi";
import s from "./Professor.module.css";

export default function ProfessorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    professorApi.getDashboard().then(setData);
  }, []);

  if (!data) {
    return <div className={s.loading}>Cargando panel del profesor...</div>;
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <span className={s.kicker}>Frog Software Ltda.</span>
          <h1>Panel del Profesor</h1>
          <p>Gestión de tareas, entregas, intentos, criterios y auditoría.</p>
        </div>

        <Link to="/professor/assignments" className={s.primaryBtn}>
          Gestionar tareas
          <FiArrowRight />
        </Link>
      </div>

      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiBookOpen />
          </div>
          <div>
            <span>Tareas creadas</span>
            <strong>{data.totalAssignments}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiClock />
          </div>
          <div>
            <span>Tareas abiertas</span>
            <strong>{data.openAssignments}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiCheckCircle />
          </div>
          <div>
            <span>Calificadas</span>
            <strong>{data.gradedSubmissions}</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiAlertCircle />
          </div>
          <div>
            <span>Pendientes</span>
            <strong>{data.pendingSubmissions}</strong>
          </div>
        </div>
      </div>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Tareas recientes</h2>
            <p>Últimas tareas creadas por el profesor.</p>
          </div>

          <Link to="/professor/assignments" className={s.textLink}>
            Ver todas
            <FiArrowRight />
          </Link>
        </div>

        <div className={s.cardGrid}>
          {data.recentAssignments.map((assignment) => (
            <Link
              key={assignment.id}
              to={`/professor/assignments/${assignment.id}`}
              className={s.assignmentCard}
            >
              <div className={s.assignmentTop}>
                <span className={s.languageBadge}>
                  <FiCode />
                  {assignment.language}
                </span>

                <span
                  className={
                    new Date(assignment.deadline) > new Date()
                      ? s.openBadge
                      : s.closedBadge
                  }
                >
                  {new Date(assignment.deadline) > new Date()
                    ? "Abierta"
                    : "Cerrada"}
                </span>
              </div>

              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>

              <small>Fecha límite: {formatDate(assignment.deadline)}</small>
            </Link>
          ))}
        </div>
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