import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiShield,
  FiDatabase,
  FiUser,
} from "react-icons/fi";
import s from "./ProfessorLayout.module.css";

export default function ProfessorLayout({ children }) {
  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <div className={s.brand}>
          <div className={s.logo}>FG</div>
          <div>
            <h2>FrogGrade</h2>
            <span>Professor Panel</span>
          </div>
        </div>

        <nav className={s.nav}>
          <NavLink to="/professor"><FiHome />Panel</NavLink>
          <NavLink to="/professor/assignments"><FiBookOpen />Tareas</NavLink>
        </nav>

        <div className={s.userBox}>
          <div className={s.avatar}><FiUser /></div>
          <div>
            <strong>María Profesora</strong>
            <p>Profesor</p>
          </div>
        </div>
      </aside>

      <main className={s.content}>{children}</main>
    </div>
  );
}