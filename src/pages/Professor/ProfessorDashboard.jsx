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
    professorApi.getDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className={s.loading}>Cargando panel...</div>;

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <div>
          <span className={s.kicker}>Frog Software Ltda.</span>
          <h1>Panel del Profesor</h1>
          <p>Gestión de tareas, entregas, intentos, calificación y auditoría.</p>
        </div>

        <Link to="/professor/assignments" className={s.primaryBtn}>
          Gestionar tareas <FiArrowRight />
        </Link>
      </div>

      <div className={s.statsGrid}>
        <Stat icon={<FiBookOpen />} label="Tareas" value={data.totalAssignments} />
        <Stat icon={<FiClock />} label="Abiertas" value={data.openAssignments} />
        <Stat icon={<FiCheckCircle />} label="Calificadas" value={data.gradedSubmissions} />
        <Stat icon={<FiAlertCircle />} label="Pendientes" value={data.pendingSubmissions} />
      </div>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2>Tareas recientes</h2>
            <p>Últimas tareas registradas en Submission Service.</p>
          </div>
          <Link to="/professor/assignments" className={s.textLink}>
            Ver todas <FiArrowRight />
          </Link>
        </div>

        <div className={s.cardGrid}>
          {data.recentAssignments.length === 0 ? (
            <p className={s.empty}>No hay tareas registradas.</p>
          ) : (
            data.recentAssignments.map((a) => (
              <Link key={a.id} to={`/professor/assignments/${a.id}`} className={s.assignmentCard}>
                <div className={s.assignmentTop}>
                  <span className={s.languageBadge}><FiCode /> {a.language}</span>
                  <span className={new Date(a.deadline) > new Date() ? s.openBadge : s.closedBadge}>
                    {new Date(a.deadline) > new Date() ? "Abierta" : "Cerrada"}
                  </span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.description || "Sin descripción."}</p>
                <small>Fecha límite: {formatDate(a.deadline)}</small>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className={s.statCard}>
      <div className={s.statIcon}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value || 0}</strong>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-BO");
}