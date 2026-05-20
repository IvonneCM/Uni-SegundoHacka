import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { usuariosService } from '../../lib/usuariosApi';
import Swal from 'sweetalert2';
import s from './UserModal.module.css';

export default function UserModal({ user, onClose, onSaved }) {
  const isEdit = !!user;
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'student',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await usuariosService.actualizarUsuario(user.id, {
          full_name: form.full_name,
          email: form.email,
          role: form.role,
        });
      } else {
        await usuariosService.registrarUsuario(form);
      }

      onSaved();
      onClose();

      Swal.fire({
        title: isEdit ? '¡Actualizado!' : '¡Usuario creado!',
        text: isEdit
          ? 'El usuario fue actualizado correctamente.'
          : 'El nuevo usuario fue registrado correctamente.',
        icon: 'success',
        background: '#1a1e28',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student',   label: 'Estudiante', color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
    { value: 'professor', label: 'Profesor',    color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
    { value: 'admin',     label: 'Admin',       color: '#f87171', bg: 'rgba(239,68,68,0.1)'  },
  ];

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={s.modalHeader}>
          <div>
            <h3>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</h3>
            <p>{isEdit ? 'Modifica los datos del usuario' : 'Completa los datos para registrar'}</p>
          </div>
          <button className={s.btnClose} onClick={onClose}><X size={15} /></button>
        </div>

        <div className={s.divider} />

        <form onSubmit={handleSubmit} className={s.form}>

          {/* Nombre */}
          <div className={s.field}>
            <label>Nombre completo</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          {/* Email */}
          <div className={s.field}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          {/* Contraseña */}
          {!isEdit && (
            <div className={s.field}>
              <label>Contraseña</label>
              <div className={s.inputWrapper}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* Rol */}
          <div className={s.field}>
            <label>Rol</label>
            <div className={s.roleGrid}>
              {roleOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${s.roleBtn} ${form.role === opt.value ? s.roleActive : ''}`}
                  style={form.role === opt.value
                    ? { background: opt.bg, borderColor: opt.color, color: opt.color }
                    : {}}
                  onClick={() => setForm(prev => ({ ...prev, role: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className={s.error}>{error}</p>}

          <div className={s.divider} />

          <div className={s.modalFooter}>
            <button type="button" className={s.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={s.btnSubmit} disabled={loading}>
              {loading
                ? 'Guardando...'
                : isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}