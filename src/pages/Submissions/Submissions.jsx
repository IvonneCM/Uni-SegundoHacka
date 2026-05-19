import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { submissionService } from '../../lib/api';
import Badge from '../../components/Badge/Badge';
import s from './Submissions.module.css';

export default function Submissions() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignment_id');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = user?.role === 'student'
      ? submissionService.getMySubmissions()
      : submissionService.getSubmissions(assignmentId || '');

    fetch
      .then(data => setSubmissions(Array.isArray(data) ? data : data.submissions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, assignmentId]);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>{user?.role === 'student' ? 'Mis entregas' : 'Entregas'}</h1>
          <p className={s.sub}>{submissions.length} registros</p>
        </div>
      </div>

      {loading ? (
        <p className={s.muted}>Cargando...</p>
      ) : submissions.length === 0 ? (
        <p className={s.muted}>No hay entregas.</p>
      ) : (
        <div className={s.tableWrap}>
          <div className={s.tableHeader}>
            <span>Tarea</span>
            <span>Estudiante</span>
            <span>Intento</span>
            <span>Estado</span>
            <span>Nota</span>
            <span>Plagio int.</span>
            <span>Resultado plagio</span>
            <span>Fecha</span>
            <span></span>
          </div>
          {submissions.map(sub => {
            const id = sub.submission_id || sub.id;
            return (
              <div key={id} className={s.tableRow}>
                <span className={s.cell}>{sub.assignment_title || '—'}</span>
                <span className={s.cell}>{sub.student_name || user?.full_name || '—'}</span>
                <span className={`${s.cell} ${s.mono}`}>#{sub.attempt_number}</span>
                <span className={s.cell}><Badge type={sub.status} /></span>
                <span className={`${s.cell} ${s.score}`}>{sub.final_score ?? '—'}</span>
                <span className={`${s.cell} ${s.mono}`}>
                  {sub.internal_similarity != null ? `${sub.internal_similarity}%` : '—'}
                </span>
                <span className={s.cell}>
                  {sub.plagiarism_result ? <Badge type={sub.plagiarism_result} /> : '—'}
                </span>
                <span className={`${s.cell} ${s.date}`}>{fmtDate(sub.submitted_at)}</span>
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
