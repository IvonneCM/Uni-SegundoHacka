import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCode,
  FiPlay,
  FiSave,
  FiShield,
} from "react-icons/fi";
import s from "./Professor.module.css";

export default function ProfessorGrading() {
  const { submissionId } = useParams();

  const [criteria, setCriteria] = useState([
    {
      id: 1,
      name: "Correctitud",
      description: "El código cumple con la salida esperada.",
      maxScore: 50,
      score: 40,
    },
    {
      id: 2,
      name: "Uso de estructuras",
      description: "Usa ciclos, condicionales o funciones correctamente.",
      maxScore: 30,
      score: 25,
    },
    {
      id: 3,
      name: "Buenas prácticas",
      description: "Código claro, ordenado y entendible.",
      maxScore: 20,
      score: 15,
    },
  ]);

  const [tests, setTests] = useState([
    {
      id: 1,
      input: "5",
      expected: "25",
      obtained: "25",
      status: "passed",
      score: 25,
    },
    {
      id: 2,
      input: "10",
      expected: "100",
      obtained: "100",
      status: "passed",
      score: 25,
    },
  ]);

  const [plagiarism] = useState({
    internalSimilarity: 18,
    externalSimilarity: 12,
    result: "low_risk",
  });

  const [executionLog] = useState(
    "Compilación correcta.\nEjecución finalizada.\n2/2 pruebas superadas."
  );

  const totalScore = useMemo(() => {
    return criteria.reduce((acc, item) => acc + Number(item.score || 0), 0);
  }, [criteria]);

  const maxScore = useMemo(() => {
    return criteria.reduce((acc, item) => acc + Number(item.maxScore || 0), 0);
  }, [criteria]);

  const updateScore = (id, value) => {
    setCriteria((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              score: Math.min(Number(value), item.maxScore),
            }
          : item
      )
    );
  };

  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "Calificación registrada",
      text: `La nota final es ${totalScore}/${maxScore}.`,
      confirmButtonColor: "#6ee7b7",
    });
  };

  const handleRun = () => {
    Swal.fire({
      icon: "info",
      title: "Ejecución simulada",
      text: "El código fue ejecutado y las pruebas fueron procesadas.",
      confirmButtonColor: "#6ee7b7",
    });
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <Link to="/professor/assignments" className={s.backBtn}>
            <FiArrowLeft />
            Volver
          </Link>

          <span className={s.kicker}>Grading Service</span>
          <h1>Calificación automática</h1>
          <p>
            Evaluación del envío, criterios del profesor, pruebas automáticas y
            revisión de plagio.
          </p>
        </div>

        <button className={s.primaryBtn} onClick={handleSave}>
          <FiSave />
          Guardar nota
        </button>
      </div>

      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiCheckCircle />
          </div>
          <div>
            <span>Nota final</span>
            <strong>
              {totalScore}/{maxScore}
            </strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiPlay />
          </div>
          <div>
            <span>Pruebas aprobadas</span>
            <strong>
              {tests.filter((t) => t.status === "passed").length}/
              {tests.length}
            </strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiShield />
          </div>
          <div>
            <span>Plagio interno</span>
            <strong>{plagiarism.internalSimilarity}%</strong>
          </div>
        </div>

        <div className={s.statCard}>
          <div className={s.statIcon}>
            <FiCode />
          </div>
          <div>
            <span>Submission ID</span>
            <strong className={s.smallStrong}>{submissionId.slice(0, 8)}</strong>
          </div>
        </div>
      </div>

      <div className={s.gradingGrid}>
        <section className={s.section}>
          <div className={s.sectionHeader}>
            <div>
              <h2>Criterios de calificación</h2>
              <p>Estos criterios son definidos por el profesor.</p>
            </div>
          </div>

          <div className={s.criteriaList}>
            {criteria.map((item) => (
              <div className={s.criteriaCard} key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  <small>Máximo: {item.maxScore} pts</small>
                </div>

                <input
                  type="number"
                  min="0"
                  max={item.maxScore}
                  value={item.score}
                  onChange={(e) => updateScore(item.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <div className={s.sectionHeader}>
            <div>
              <h2>Pruebas automáticas</h2>
              <p>Simulación de ejecución del código enviado.</p>
            </div>

            <button className={s.secondaryBtn} onClick={handleRun}>
              <FiPlay />
              Ejecutar
            </button>
          </div>

          <div className={s.testsList}>
            {tests.map((test) => (
              <div className={s.testCard} key={test.id}>
                <span className={s.openBadge}>{test.status}</span>
                <p>
                  <b>Input:</b> {test.input}
                </p>
                <p>
                  <b>Esperado:</b> {test.expected}
                </p>
                <p>
                  <b>Obtenido:</b> {test.obtained}
                </p>
                <small>Puntaje: {test.score}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={s.gradingGrid}>
        <section className={s.section}>
          <div className={s.sectionHeader}>
            <div>
              <h2>Reporte de plagio</h2>
              <p>Comparación interna y servicio externo tipo TurnItIn.</p>
            </div>
          </div>

          <div className={s.infoGrid}>
            <div>
              <span>Similitud interna</span>
              <strong>{plagiarism.internalSimilarity}%</strong>
            </div>

            <div>
              <span>Similitud externa</span>
              <strong>{plagiarism.externalSimilarity}%</strong>
            </div>

            <div>
              <span>Resultado</span>
              <strong>{plagiarism.result}</strong>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.sectionHeader}>
            <div>
              <h2>Logs de ejecución</h2>
              <p>Registro auditable de la ejecución.</p>
            </div>
          </div>

          <pre className={s.logBox}>{executionLog}</pre>
        </section>
      </div>
    </div>
  );
}