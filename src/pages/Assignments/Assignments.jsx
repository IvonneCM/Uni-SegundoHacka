import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { submissionService } from '../../lib/api';
import s from './Assignments.module.css';

const LANGS = ['javascript', 'python', 'java', 'c', 'cpp', 'typescript', 'go', 'rust'];

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', language: 'javascript', deadline: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isProfOrAdmin = user?.role === 'professor' || user?.role === 'admin';

  const load = () => {
    submissionService.getAssignments()
      .then(data => setAssignments(Array.isArray(data) ? data : data.assignments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.title || !form.deadline) return setError('Título y fecha límite son requeridos');
    setSaving(true); setError('');
    try {
      await submissionService.createAssignment(form);
      setShowForm(false);
      setForm({ title: '', description: '', language: 'javascript', deadline: '' });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const isActive = (deadline) => new Date(deadline) > new Date();

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Tareas</h1>
          <p className={s.sub}>Asignaciones de programación</p>
        </div>
        {isProfOrAdmin && (
          <button className={s.createBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancelar' : '+ Nueva tarea'}
          </button>
        )}
      </div>

      {showForm && (
        <div className={s.formCard}>
          <h2 className={s.formTitle}>Crear asignación</h2>
          <div className={s.formGrid}>
            <div className={s.field}>
              <label>Título *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Algoritmos de ordenamiento" />
            </div>
            <div className={s.field}>
              <label>Lenguaje</label>
              <select value={form.language} onChange={e => set('language', e.target.value)}>
                {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className={`${s.field} ${s.fullWidth}`}>
              <label>Descripción</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Descripción del problema..." />
            </div>
            <div className={s.field}>
              <label>Fecha límite *</label>
              <input type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
          </div>
          {error && <p className={s.error}>{error}</p>}
          <div className={s.formActions}>
            <button className={s.saveBtn} onClick={handleCreate} disabled={saving}>
              {saving ? 'Guardando...' : 'Crear tarea'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className={s.muted}>Cargando tareas...</p>
      ) : assignments.length === 0 ? (
        <p className={s.muted}>No hay tareas disponibles.</p>
      ) : (
        <div className={s.grid}>
          {assignments.map(a => (
            <div key={a.id} className={`${s.card} ${!isActive(a.deadline) ? s.expired : ''}`}>
              <div className={s.cardTop}>
                <span className={`${s.langTag} ${s[a.language] || ''}`}>{a.language}</span>
                <span className={isActive(a.deadline) ? s.active : s.expiredTag}>
                  {isActive(a.deadline) ? '● Activa' : '○ Vencida'}
                </span>
              </div>
              <h3 className={s.cardTitle}>{a.title}</h3>
              <p className={s.cardDesc}>{a.description || 'Sin descripción.'}</p>
              <div className={s.cardFooter}>
                <span className={s.deadline}>⏱ {fmtDate(a.deadline)}</span>
                {user?.role === 'student' && isActive(a.deadline) && (
                  <Link to={`/assignments/${a.id}/submit`} className={s.submitBtn}>
                    Enviar código →
                  </Link>
                )}
                {isProfOrAdmin && (
                  <Link to={`/submissions?assignment_id=${a.id}`} className={s.viewBtn}>
                    Ver entregas →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
