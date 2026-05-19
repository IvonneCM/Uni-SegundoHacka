import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { submissionService } from '../../lib/api';
import Badge from '../../components/Badge/Badge';
import s from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'student') {
      submissionService.getMySubmissions()
        .then(data => setSubmissions(Array.isArray(data) ? data : data.submissions || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const graded = submissions.filter(s => s.status === 'graded');
  const avgScore = graded.length
    ? (graded.reduce((a, s) => a + (s.final_score || 0), 0) / graded.length).toFixed(1)
    : '—';

  return (
    <div>
      <div className={s.hero}>
        <div>
          <p className={s.greeting}>Bienvenido/a,</p>
          <h1 className={s.name}>{user?.full_name}</h1>
        </div>
        <Badge type={user?.role} />
      </div>

      {user?.role === 'student' && (
        <>
          <div className={s.stats}>
            <div className={s.statCard}>
              <p className={s.statLabel}>Envíos totales</p>
              <p className={s.statVal}>{submissions.length}</p>
            </div>
            <div className={s.statCard}>
              <p className={s.statLabel}>Calificados</p>
              <p className={s.statVal}>{graded.length}</p>
            </div>
            <div className={s.statCard}>
              <p className={s.statLabel}>Promedio</p>
              <p className={s.statVal} style={{ color: '#6ee7b7' }}>{avgScore}</p>
            </div>
            <div className={s.statCard}>
              <p className={s.statLabel}>Pendientes</p>
              <p className={s.statVal}>{submissions.filter(s => s.status === 'submitted').length}</p>
            </div>
          </div>

          <div className={s.section}>
            <div className={s.sectionHeader}>
              <h2>Últimas entregas</h2>
              <Link to="/submissions">Ver todas →</Link>
            </div>

            {loading ? (
              <p className={s.muted}>Cargando...</p>
            ) : submissions.length === 0 ? (
              <div className={s.empty}>
                <p>No has enviado código aún.</p>
                <Link to="/assignments" className={s.cta}>Ver tareas disponibles →</Link>
              </div>
            ) : (
              <div className={s.table}>
                <div className={s.tableHeader}>
                  <span>Tarea</span>
                  <span>Intento</span>
                  <span>Estado</span>
                  <span>Nota</span>
                  <span>Plagio</span>
                </div>
                {submissions.slice(0, 6).map(sub => (
                  <Link to={`/submissions/${sub.submission_id || sub.id}`} key={sub.submission_id || sub.id} className={s.tableRow}>
                    <span className={s.assignTitle}>{sub.assignment_title || 'Tarea'}</span>
                    <span className={s.mono}>#{sub.attempt_number}</span>
                    <span><Badge type={sub.status} /></span>
                    <span className={s.score}>{sub.final_score ?? '—'}</span>
                    <span>{sub.plagiarism_result ? <Badge type={sub.plagiarism_result} /> : '—'}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {(user?.role === 'professor' || user?.role === 'admin') && (
        <div className={s.quickLinks}>
          <Link to="/assignments" className={s.quickCard}>
            <span className={s.quickIcon}>◈</span>
            <p className={s.quickTitle}>Gestionar Tareas</p>
            <p className={s.quickSub}>Crear y configurar asignaciones</p>
          </Link>
          <Link to="/submissions" className={s.quickCard}>
            <span className={s.quickIcon}>◉</span>
            <p className={s.quickTitle}>Ver Entregas</p>
            <p className={s.quickSub}>Revisar código de estudiantes</p>
          </Link>
          <Link to="/results" className={s.quickCard}>
            <span className={s.quickIcon}>◎</span>
            <p className={s.quickTitle}>Resultados</p>
            <p className={s.quickSub}>Notas y estado de ejecución</p>
          </Link>
          {user?.role === 'admin' && (
            <Link to="/audit" className={s.quickCard}>
              <span className={s.quickIcon}>◑</span>
              <p className={s.quickTitle}>Auditoría</p>
              <p className={s.quickSub}>Logs del sistema</p>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
