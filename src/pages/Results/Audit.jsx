import { useEffect, useState } from 'react';
import { auditService } from '../../lib/api';
import s from './Audit.module.css';

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [lmsLogs, setLmsLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('audit');

  useEffect(() => {
    Promise.allSettled([
      auditService.getLogs().then(d => setLogs(Array.isArray(d) ? d : d.logs || [])),
      auditService.getLmsSyncLogs().then(d => setLmsLogs(Array.isArray(d) ? d : d.logs || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const fmtDate = d => d ? new Date(d).toLocaleString('es') : '—';

  const displayLogs = tab === 'audit' ? logs : lmsLogs;

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Auditoría</h1>
          <p className={s.sub}>Registros del sistema</p>
        </div>
      </div>

      <div className={s.tabs}>
        <button className={`${s.tab} ${tab === 'audit' ? s.active : ''}`} onClick={() => setTab('audit')}>
          Audit Logs ({logs.length})
        </button>
        <button className={`${s.tab} ${tab === 'lms' ? s.active : ''}`} onClick={() => setTab('lms')}>
          LMS Sync ({lmsLogs.length})
        </button>
      </div>

      {loading ? (
        <p className={s.muted}>Cargando logs...</p>
      ) : displayLogs.length === 0 ? (
        <p className={s.muted}>No hay registros.</p>
      ) : tab === 'audit' ? (
        <div className={s.tableWrap}>
          <div className={`${s.tableHeader} ${s.auditHeader}`}>
            <span>Servicio</span>
            <span>Acción</span>
            <span>Entidad</span>
            <span>Usuario</span>
            <span>Fecha</span>
          </div>
          {logs.map(log => (
            <div key={log.id} className={`${s.tableRow} ${s.auditRow}`}>
              <span className={`${s.cell} ${s.service}`}>{log.service_name}</span>
              <span className={s.cell}>{log.action}</span>
              <span className={`${s.cell} ${s.mono}`}>{log.entity_name || '—'}</span>
              <span className={s.cell}>{log.user_id ? log.user_id.slice(0, 8) + '…' : 'sistema'}</span>
              <span className={`${s.cell} ${s.date}`}>{fmtDate(log.created_at)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.tableWrap}>
          <div className={`${s.tableHeader} ${s.lmsHeader}`}>
            <span>Tipo</span>
            <span>Estado</span>
            <span>Mensaje</span>
            <span>Fecha</span>
          </div>
          {lmsLogs.map(log => (
            <div key={log.id} className={`${s.tableRow} ${s.lmsRow}`}>
              <span className={s.cell}>{log.sync_type}</span>
              <span className={s.cell}>
                <span className={s[log.status]}>{log.status}</span>
              </span>
              <span className={s.cell}>{log.message || '—'}</span>
              <span className={`${s.cell} ${s.date}`}>{fmtDate(log.synced_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
