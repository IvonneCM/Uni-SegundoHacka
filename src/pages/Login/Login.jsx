import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Eye, EyeOff } from 'lucide-react';
import s from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            <div className={s.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                type="button"
                className={s.eyeBtn}
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className={s.error}>{error}</p>}

          <button className={s.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}