import { FiDatabase, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import s from "./Professor.module.css";

const syncs = [
  {
    id: 1,
    type: "Sincronización de tarea",
    status: "success",
    message: "La tarea fue enviada al LMS mainframe.",
  },
  {
    id: 2,
    type: "Sincronización de nota",
    status: "pending",
    message: "La nota está pendiente de ser enviada al LMS.",
  },
];

export default function ProfessorLms() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <span className={s.kicker}>LMS Integration Service</span>
        <h1>Integración LMS</h1>
        <p>Control de sincronización con el sistema académico mainframe.</p>
      </div>

      <div className={s.cardGrid}>
        {syncs.map((item) => (
          <div className={s.assignmentCard} key={item.id}>
            <span className={s.languageBadge}>
              {item.status === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
              {item.status}
            </span>
            <h3><FiDatabase /> {item.type}</h3>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}