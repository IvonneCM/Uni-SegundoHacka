import { FiShield, FiClock, FiUser, FiServer } from "react-icons/fi";
import s from "./Professor.module.css";

const logs = [
  {
    id: 1,
    action: "ASSIGNMENT_CREATED",
    user: "María Profesora",
    service: "submission-service",
    description: "Se creó una tarea con fecha límite.",
    date: "19/05/2026 19:10",
  },
  {
    id: 2,
    action: "SUBMISSION_CREATED",
    user: "Juan Estudiante",
    service: "submission-service",
    description: "El estudiante envió código fuente.",
    date: "19/05/2026 19:20",
  },
  {
    id: 3,
    action: "GRADE_GENERATED",
    user: "grading-service",
    service: "grading-service",
    description: "Se generó calificación automática.",
    date: "19/05/2026 19:22",
  },
];

export default function ProfessorAudit() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <span className={s.kicker}>Audit Service</span>
        <h1>Auditoría académica</h1>
        <p>Registro trazable para revisión estatal de notas, envíos y cambios.</p>
      </div>

      <div className={s.auditList}>
        {logs.map((log) => (
          <div className={s.auditCard} key={log.id}>
            <div className={s.auditIcon}><FiShield /></div>

            <div className={s.auditContent}>
              <div className={s.auditTop}>
                <strong>{log.action}</strong>
                <small>{log.service}</small>
              </div>

              <p>{log.description}</p>

              <div className={s.auditMeta}>
                <span><FiUser /> {log.user}</span>
                <span><FiClock /> {log.date}</span>
                <span><FiServer /> {log.service}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}