import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submissionService } from '../../lib/api';
import Badge from '../../components/Badge/Badge';
import s from './Results.module.css';

export default function Results() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    submissionService.getSubmissions('')
      .then(data => setSubmissions(Array.isArray(data) ? data : data.submissions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? submissions
    : submissions.filter(s => s.plagiarism_result === filter || s.status === filter);

  const graded = submissions.filter(s => s.final_score != null);
  const avg = graded.length ? (graded.reduce((a, s) => a + (s.final_score || 0), 0) / graded.length).toFixed(1) : '—';
  const highRisk = submissions.filter(s => s.plagiarism_result === 'high_risk').length;

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Resultados</h1>
          <p className={s.sub}>Vista consolidada de calificaciones y plagio</p>
        </div>
      </div>

      <div className={s.stats}>
        <div className={s.statCard}>
          <p className={s.statLabel}>Total entregas</p>
          <p className={s.statVal}>{submissions.length}</p>
        </div>
        <div className={s.statCard}>
          <p className={s.statLabel}>Promedio general</p>
          <p className={s.statVal} style={{ color: '#6ee7b7' }}>{avg}</p>
        </div>
        <div className={s.statCard}>
          <p className={s.statLabel}>Alto riesgo plagio</p>
          <p className={s.statVal} style={{ color: highRisk > 0 ? '#f87171' : '#6ee7b7' }}>{highRisk}</p>
        </div>
        <div className={s.statCard}>
          <p className={s.statLabel}>Calificados</p>
          <p className={s.statVal}>{graded.length}</p>
        </div>
      </div>

      <div className={s.filters}>
        {['all', 'graded', 'submitted', 'high_risk', 'medium_risk'].map(f => (
          <button key={f} className={`${s.filterBtn} ${filter === f ? s.active : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Todos' : f === 'graded' ? 'Calificados' : f === 'submitted' ? 'Pendientes' : f === 'high_risk' ? '🔴 Alto riesgo' : '🟡 Riesgo medio'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={s.muted}>Cargando...</p>
      ) : (
        <div className={s.tableWrap}>
          <div className={s.tableHeader}>
            <span>Estudiante</span>
            <span>Tarea</span>
            <span>Intento</span>
            <span>Nota</span>
            <span>Ejecución</span>
            <span>Plagio int.</span>
            <span>Plagio ext.</span>
            <span>Resultado</span>
            <span></span>
          </div>
          {filtered.map(sub => {
            const id = sub.submission_id || sub.id;
            return (
              <div key={id} className={s.tableRow}>
                <span className={s.cell}>{sub.student_name || '—'}</span>
                <span className={s.cell}>{sub.assignment_title || '—'}</span>
                <span className={`${s.cell} ${s.mono}`}>#{sub.attempt_number}</span>
                <span className={`${s.cell} ${s.score}`}>
                  {sub.final_score != null ? sub.final_score : '—'}
                </span>
                <span className={s.cell}>
                  {sub.execution_status ? <Badge type={sub.execution_status} /> : '—'}
                </span>
                <span className={`${s.cell} ${s.mono}`}>
                  {sub.internal_similarity != null ? `${sub.internal_similarity}%` : '—'}
                </span>
                <span className={`${s.cell} ${s.mono}`}>
                  {sub.external_similarity != null ? `${sub.external_similarity}%` : '—'}
                </span>
                <span className={s.cell}>
                  {sub.plagiarism_result ? <Badge type={sub.plagiarism_result} /> : '—'}
                </span>
                <span className={s.cell}>
                  <Link to={`/submissions/${id}`} className={s.viewLink}>Ver →</Link>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
