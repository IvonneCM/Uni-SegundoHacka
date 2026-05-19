import s from './Badge.module.css';

const variants = {
  // submission status
  submitted:   { label: 'Enviado',     cls: s.blue },
  graded:      { label: 'Calificado',  cls: s.green },
  rejected:    { label: 'Rechazado',   cls: s.red },
  plagiarism_review: { label: 'Plagio pendiente', cls: s.warn },
  // execution
  success:     { label: 'Éxito',       cls: s.green },
  failed:      { label: 'Fallido',     cls: s.red },
  compile_error: { label: 'Error compilación', cls: s.red },
  runtime_error: { label: 'Error ejecución', cls: s.orange },
  // plagiarism
  low_risk:    { label: 'Bajo riesgo', cls: s.green },
  medium_risk: { label: 'Riesgo medio', cls: s.warn },
  high_risk:   { label: 'Alto riesgo', cls: s.red },
  // role
  student:     { label: 'Estudiante',  cls: s.blue },
  professor:   { label: 'Profesor',    cls: s.purple },
  admin:       { label: 'Admin',       cls: s.red },
};

export default function Badge({ type, label: customLabel }) {
  const v = variants[type] || { label: type || '—', cls: s.gray };
  return <span className={`${s.badge} ${v.cls}`}>{customLabel || v.label}</span>;
}
