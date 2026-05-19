import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionService } from '../../lib/api';
import s from './SubmitCode.module.css';

export default function SubmitCode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    submissionService.getAssignmentById(id)
      .then(setAssignment)
      .catch(() => {});
  }, [id]);

  const handleSubmit = async () => {
    if (!code.trim()) return setError('El código no puede estar vacío');
    setSubmitting(true); setError('');
    try {
      const result = await submissionService.submitCode({
        assignment_id: id,
        source_code: code,
        language: assignment?.language || 'javascript',
      });
      setSuccess(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={s.success}>
        <div className={s.successIcon}>✓</div>
        <h2>¡Código enviado!</h2>
        <p>Intento <strong>#{success.attempt_number}</strong> registrado correctamente.</p>
        <p className={s.muted}>El sistema está calificando y revisando plagio en segundo plano.</p>
        <div className={s.successActions}>
          <button onClick={() => navigate(`/submissions/${success.id}`)} className={s.viewBtn}>
            Ver resultado →
          </button>
          <button onClick={() => { setSuccess(null); setCode(''); }} className={s.retryBtn}>
            Nuevo intento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={s.header}>
        <button className={s.back} onClick={() => navigate('/assignments')}>← Tareas</button>
        {assignment && (
          <div className={s.assignInfo}>
            <h1 className={s.title}>{assignment.title}</h1>
            <p className={s.desc}>{assignment.description}</p>
            <div className={s.meta}>
              <span className={s.lang}>{assignment.language}</span>
              <span className={s.deadline}>
                Entrega: {new Date(assignment.deadline).toLocaleString('es')}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={s.editor}>
        <div className={s.editorHeader}>
          <span className={s.editorLabel}>
            <span className={s.dot} style={{ background: '#f87171' }} />
            <span className={s.dot} style={{ background: '#fbbf24' }} />
            <span className={s.dot} style={{ background: '#6ee7b7' }} />
            &nbsp; {assignment?.language || 'código'}
          </span>
          <span className={s.lineCount}>{code.split('\n').length} líneas</span>
        </div>
        <textarea
          className={s.codeArea}
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder={`// Escribe tu solución en ${assignment?.language || 'código'} aquí\n\n`}
          spellCheck={false}
        />
      </div>

      {error && <p className={s.error}>{error}</p>}

      <div className={s.actions}>
        <span className={s.hint}>El sistema calificará automáticamente tu código</span>
        <button className={s.submitBtn} onClick={handleSubmit} disabled={submitting || !code.trim()}>
          {submitting ? 'Enviando...' : 'Enviar código ↗'}
        </button>
      </div>
    </div>
  );
}
