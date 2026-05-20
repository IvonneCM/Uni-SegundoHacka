import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { submissionService, plagiarismService } from "../../lib/api";
import { getGradingBySubmissionApi } from "../../lib/grading.api";

import Badge from "../../components/Badge/Badge";
import s from "./SubmissionDetail.module.css";

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [grading, setGrading] = useState(null);
  const [plagiarism, setPlagiarism] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      setLoading(true);

      const p1 = submissionService
        .getSubmissionById(id)
        .then(setSubmission)
        .catch(() => null);

      const p2 = submissionService
        .getSubmissionSummary(id)
        .then(setSummary)
        .catch(() => null);

      const p3 = getGradingBySubmissionApi(id)
        .then(setGrading)
        .catch(() => null);

      const p4 = plagiarismService
        .getReport(id)
        .then(setPlagiarism)
        .catch(() => null);

      await Promise.allSettled([p1, p2, p3, p4]);
    } finally {
      setLoading(false);
    }
  };

  const data = summary || submission || {};

  const finalScore =
    grading?.final_score_confirmed ??
    grading?.teacher_score ??
    grading?.final_score ??
    grading?.automatic_score ??
    "—";

  const automaticScore =
    grading?.automatic_score ??
    grading?.final_score ??
    "—";

  if (loading) {
    return <div className={s.loading}>Cargando...</div>;
  }

  return (
    <div>
      <button className={s.back} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className={s.hero}>
        <div>
          <h1 className={s.title}>{data.assignment_title || "Entrega"}</h1>
          <p className={s.sub}>
            {data.student_name || "—"} · Intento #{data.attempt_number || "—"}
          </p>
        </div>

        <Badge type={data.status || data.submission_status || "submitted"} />
      </div>

      {grading && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>◎ Calificación</h2>

          <div className={s.scoreRow}>
            <div className={s.scoreCircle}>
              <span className={s.scoreVal}>{finalScore}</span>
              <span className={s.scoreLabel}>/ 100</span>
            </div>

            <div className={s.scoreInfo}>
              <div className={s.infoRow}>
                <span className={s.infoKey}>Nota automática</span>
                <span className={s.infoVal}>{automaticScore}</span>
              </div>

              <div className={s.infoRow}>
                <span className={s.infoKey}>Nota docente</span>
                <span className={s.infoVal}>
                  {grading.teacher_score ?? "Pendiente de revisión"}
                </span>
              </div>

              <div className={s.infoRow}>
                <span className={s.infoKey}>Nota final confirmada</span>
                <span className={s.infoVal}>
                  {grading.final_score_confirmed ?? "Pendiente"}
                </span>
              </div>

              <div className={s.infoRow}>
                <span className={s.infoKey}>Estado de ejecución</span>
                <Badge type={grading.execution_status} />
              </div>

              {grading.graded_at && (
                <div className={s.infoRow}>
                  <span className={s.infoKey}>Calificado el</span>
                  <span className={s.infoVal}>
                    {new Date(grading.graded_at).toLocaleString("es-BO")}
                  </span>
                </div>
              )}

              {grading.reviewed_at && (
                <div className={s.infoRow}>
                  <span className={s.infoKey}>Revisado el</span>
                  <span className={s.infoVal}>
                    {new Date(grading.reviewed_at).toLocaleString("es-BO")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {grading.teacher_feedback && (
            <div className={s.codeBlock}>
              <p className={s.codeLabel}>Observación del docente</p>
              <pre className={s.pre}>{grading.teacher_feedback}</pre>
            </div>
          )}

          {grading.execution_output && (
            <div className={s.codeBlock}>
              <p className={s.codeLabel}>Salida del programa</p>
              <pre className={s.pre}>{grading.execution_output}</pre>
            </div>
          )}

          {grading.execution_logs && (
            <div className={s.codeBlock}>
              <p className={s.codeLabel}>Logs de ejecución</p>
              <pre className={s.pre}>{grading.execution_logs}</pre>
            </div>
          )}
        </div>
      )}

      {!grading && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>◎ Calificación</h2>
          <p className={s.sub}>Esta entrega todavía no fue calificada.</p>
        </div>
      )}

      {plagiarism && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>◑ Análisis de plagio</h2>

          <div className={s.plagiarismGrid}>
            <div className={s.plagCard}>
              <p className={s.plagLabel}>Similitud interna</p>
              <p
                className={s.plagVal}
                style={{ color: getColor(plagiarism.internal_similarity) }}
              >
                {plagiarism.internal_similarity ?? 0}%
              </p>
            </div>

            <div className={s.plagCard}>
              <p className={s.plagLabel}>Similitud externa</p>
              <p
                className={s.plagVal}
                style={{ color: getColor(plagiarism.external_similarity) }}
              >
                {plagiarism.external_similarity ?? 0}%
              </p>
            </div>

            <div className={s.plagCard}>
              <p className={s.plagLabel}>Resultado</p>
              <div style={{ marginTop: 8 }}>
                <Badge type={plagiarism.result} />
              </div>
            </div>

            <div className={s.plagCard}>
              <p className={s.plagLabel}>Servicio externo</p>
              <p className={s.plagService}>
                {plagiarism.external_service || "—"}
              </p>
            </div>
          </div>

          {plagiarism.details && (
            <p className={s.plagDetails}>{plagiarism.details}</p>
          )}
        </div>
      )}

      {(submission?.source_code || data.source_code) && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>◈ Código enviado</h2>

          <div className={s.codeBlock}>
            <pre className={s.pre}>
              {submission?.source_code || data.source_code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function getColor(val) {
  if (!val) return "#6ee7b7";
  if (val < 30) return "#6ee7b7";
  if (val < 60) return "#fbbf24";
  return "#f87171";
}