import { useEffect, useState } from 'react';
import { authService } from '../../lib/api';
import Badge from '../../components/Badge/Badge';
import s from './Users.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getUsers()
      .then(data => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2>Gestión de Usuarios</h2>
        <p>Directorio de estudiantes, profesores y administradores</p>
      </div>
      {loading ? <p className={s.muted}>Cargando usuarios...</p> : (
        <div className={s.table}>
          <div className={s.tableHeader}>
            <span>Nombre</span>
            <span>Email</span>
            <span>Rol</span>
            <span>Registro</span>
          </div>
          {users.map(u => (
            <div key={u.id} className={s.tableRow}>
              <span className={s.name}>{u.full_name || u.name}</span>
              <span className={s.muted}>{u.email || '—'}</span>
              <span><Badge type={u.role || 'student'} /></span>
              <span className={s.muted}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
