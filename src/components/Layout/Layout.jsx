import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import s from './Layout.module.css';

const navItems = {
  student: [
    {
      to: "/dashboard",
      icon: "⬡",
      label: "Inicio",
    },

    {
      to: "/assignments",
      icon: "◈",
      label: "Tareas",
    },

    {
      to: "/submissions",
      icon: "◉",
      label: "Mis envíos",
    },
  ],

  professor: [
    {
      to: "/professor",
      icon: "⬡",
      label: "Panel",
    },

    {
      to: "/professor/assignments",
      icon: "◈",
      label: "Tareas",
    },

    {
      to: "/submissions",
      icon: "◉",
      label: "Entregas",
    },

    {
      to: "/results",
      icon: "◎",
      label: "Resultados",
    },
  ],

  admin: [
    {
      to: "/professor",
      icon: "⬡",
      label: "Panel",
    },

    {
      to: "/professor/assignments",
      icon: "◈",
      label: "Tareas",
    },

    {
      to: "/submissions",
      icon: "◉",
      label: "Entregas",
    },

    {
      to: "/results",
      icon: "◎",
      label: "Resultados",
    },

    {
      to: "/audit",
      icon: "◑",
      label: "Auditoría",
    },
    { to: '/dashboard', icon: '⬡', label: 'Inicio' },
    { to: '/assignments', icon: '◈', label: 'Tareas' },
    { to: '/submissions', icon: '◉', label: 'Entregas' },
    { to: '/results', icon: '◎', label: 'Resultados' },
    { to: '/users', icon: '◭', label: 'Usuarios' },
    { to: '/audit', icon: '◑', label: 'Auditoría' },
  ],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = navItems[user?.role] || navItems.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <div className={s.logo}>
          <span className={s.logoMark}>CG</span>
          <span className={s.logoText}>CodeGrade</span>
        </div>

        <nav className={s.nav}>
          {items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`${s.navItem} ${location.pathname.startsWith(item.to) ? s.active : ''}`}
            >
              <span className={s.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={s.userBlock}>
          <div className={s.avatar}>{user?.full_name?.[0] || '?'}</div>
          <div className={s.userInfo}>
            <p className={s.userName}>{user?.full_name || 'Usuario'}</p>
            <p className={s.userRole}>{user?.role}</p>
          </div>
          <button className={s.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            ⇥
          </button>
        </div>
      </aside>

      <main className={s.main}>
        {children}
      </main>
    </div>
  );
}
