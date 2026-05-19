import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import s from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError('Completa todos los campos');
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const demos = {
      student:   { email: 'student@test.com',   password: '123456' },
      professor: { email: 'professor@test.com',  password: '123456' },
      admin:     { email: 'admin@test.com',       password: '123456' },
    };
    setForm(demos[role]);
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.header}>
          <div className={s.logoMark}>CG</div>
          <h1 className={s.title}>CodeGrade</h1>
          <p className={s.subtitle}>Sistema de evaluación de código</p>
        </div>

        <div className={s.form}>
          <div className={s.field}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@dominio.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className={s.field}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className={s.error}>{error}</p>}

          <button className={s.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </div>

        <div className={s.demos}>
          <p className={s.demosLabel}>Acceso rápido</p>
          <div className={s.demosBtns}>
            {['student', 'professor', 'admin'].map(r => (
              <button key={r} className={s.demoBtn} onClick={() => fillDemo(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
