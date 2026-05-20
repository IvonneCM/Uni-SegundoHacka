import { useEffect, useState } from 'react';
import { usuariosService } from '../../lib/usuariosApi';
import { useAuth } from '../../lib/auth';
import { Pencil, Trash2, UserPlus, Users, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';
import Badge from '../../components/Badge/Badge';
import s from './Users.module.css';
import Swal from 'sweetalert2';
import UserModal from './UserModal';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    usuariosService.getUsuarios()
      .then(data => setUsers(data.usuarios || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const stats = {
    total:      users.length,
    students:   users.filter(u => u.role === 'student').length,
    professors: users.filter(u => u.role === 'professor').length,
    admins:     users.filter(u => u.role === 'admin').length,
  };

  const filtered = filterRole
    ? users.filter(u => u.role === filterRole)
    : users;

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1e28',
      color: '#e2e8f0',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      customClass: { popup: 'swal-dark' }
    });

    if (!result.isConfirmed) return;

    try {
      await usuariosService.eliminarUsuario(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      Swal.fire({
        title: 'Eliminado',
        text: 'El usuario fue eliminado correctamente.',
        icon: 'success',
        background: '#1a1e28',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el usuario.',
        icon: 'error',
        background: '#1a1e28',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1',
      });
    }
  };

  const handleAbrirNuevo = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleAbrirEditar = (u) => {
    setEditingUser(u);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className={s.container}>

      {/* Header */}
      <div className={s.header}>
        <div>
          <h2>Gestión de Usuarios</h2>
          <p>Directorio de estudiantes, profesores y administradores</p>
        </div>
        {user?.role === 'admin' && (
          <button className={s.btnAdd} onClick={handleAbrirNuevo}>
            <UserPlus size={15} /> Nuevo usuario
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className={s.stats}>
        <div className={s.statCard} onClick={() => setFilterRole('')}>
          <div className={s.statIcon} style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
            <Users size={18} />
          </div>
          <div>
            <p className={s.statNum}>{stats.total}</p>
            <p className={s.statLabel}>Total</p>
          </div>
        </div>
        <div className={s.statCard} onClick={() => setFilterRole('student')}>
          <div className={s.statIcon} style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
            <GraduationCap size={18} />
          </div>
          <div>
            <p className={s.statNum}>{stats.students}</p>
            <p className={s.statLabel}>Estudiantes</p>
          </div>
        </div>
        <div className={s.statCard} onClick={() => setFilterRole('professor')}>
          <div className={s.statIcon} style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c' }}>
            <BookOpen size={18} />
          </div>
          <div>
            <p className={s.statNum}>{stats.professors}</p>
            <p className={s.statLabel}>Profesores</p>
          </div>
        </div>
        <div className={s.statCard} onClick={() => setFilterRole('admin')}>
          <div className={s.statIcon} style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className={s.statNum}>{stats.admins}</p>
            <p className={s.statLabel}>Admins</p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? <p className={s.muted}>Cargando usuarios...</p> : (
        <div className={s.table}>
          <div className={s.tableHeader}>
            <span>Nombre</span>
            <span>Email</span>
            <span>Rol</span>
            <span>Registro</span>
            {user?.role === 'admin' && <span>Acciones</span>}
          </div>
          {filtered.map(u => (
            <div key={u.id} className={s.tableRow}>
              <span className={s.name}>{u.full_name}</span>
              <span className={s.muted}>{u.email}</span>
              <span><Badge type={u.role} /></span>
              <span className={s.muted}>
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
              </span>
              {user?.role === 'admin' && (
                <span className={s.actions}>
                  <button
                    className={s.btnIcon}
                    title="Editar"
                    onClick={() => handleAbrirEditar(u)}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className={`${s.btnIcon} ${s.btnDanger}`}
                    title="Eliminar"
                    onClick={() => handleEliminar(u.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className={s.muted} style={{ padding: '16px 12px' }}>
              No hay usuarios con ese rol.
            </p>
          )}
        </div>
      )}

      {/* Modal agregar / editar */}
      {modalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleCerrarModal}
          onSaved={cargarUsuarios}
        />
      )}

    </div>
  );
}