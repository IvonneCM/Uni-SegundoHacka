import { useEffect, useState } from 'react';
import { auditService } from '../../lib/api';
import Badge from '../../components/Badge/Badge';
import s from './LmsSync.module.css';

export default function LmsSync() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService.getLmsSyncLogs()
      .then(data => setLogs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2>Sincronización LMS</h2>
        <p>Estado de envío de notas a sistemas externos (Canvas, Moodle)</p>
      </div>
      {loading ? <p className={s.muted}>Cargando sincronizaciones...</p> : (
        <div className={s.table}>
          <div className={s.tableHeader}>
            <span>ID Sinc.</span>
            <span>Tipo</span>
            <span>Estado</span>
            <span>Mensaje</span>
            <span>Fecha</span>
          </div>
          {logs.map(log => (
            <div key={log.id} className={s.tableRow}>
              <span className={s.mono}>#{log.id?.toString().slice(0,8) || log.id}</span>
              <span>{log.sync_type || 'Nota'}</span>
              <span><Badge type={log.status || 'pending'} /></span>
              <span className={s.message}>{log.message || 'OK'}</span>
              <span className={s.muted}>{log.synced_at ? new Date(log.synced_at).toLocaleDateString() : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
