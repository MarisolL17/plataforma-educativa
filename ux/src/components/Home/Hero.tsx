import { useState } from 'react';
import { NAVY, SKY, GOLD, TEXT, MUTED, BORDER } from '../../constants/colors';
import { LockedButton } from '../Common/LockedButton';

// ─── Base de datos para la portada inicial ─────────────────────────────────
const statsData = [['32k+', 'Estudiantes activos'], ['480+', 'Cursos especializados'], ['96%', 'Tasa de completitud'], ['180+', 'Docentes expertos']];
const roadmapSteps = [
  { label: 'Álgebra Lineal',         sub: 'Completado',    done: true,   active: false },
  { label: 'Probabilidad Básica',    sub: 'Completado',    done: true,   active: false },
  { label: 'Estadística Descriptiva', sub: 'En progreso · 6h restantes', done: false, active: true },
  { label: 'Inferencia Estadística', sub: 'Próximo paso',  done: false,  active: false },
  { label: 'Regresión Lineal',       sub: 'Bloqueado',     done: false,  active: false },
];

// ─── Portada de inicio ─────────────────────────────────────────────────────
export function Hero({ authed, onAuthRequired }: { authed: boolean; onAuthRequired: () => void }) {
  const [, setActiveStep] = useState(2);

  return (
    <section style={{ background: 'linear-gradient(160deg, #FFFFFF 55%, #EBF4FB 100%)', padding: '5rem 1.5rem 4.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: '5%', width: 480, height: 480, borderRadius: '50%', background: `radial-gradient(circle, rgba(110,167,218,0.1) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: '2%', width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, rgba(250,191,56,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Etiqueta */}
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="two-col">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EBF4FB', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '1.75rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 5px #22C55E' }} />
            <span style={{ color: NAVY, fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 500 }}>Potenciado con IA Generativa · ENEI 2026</span>
          </div>

          {/* Título principal */}
          <h1 className="h-display" style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.25rem)', marginBottom: '1.25rem' }}>
            Aprende{' '}<span style={{ color: SKY }}>Estadística</span>{' '}con{' '}
            <span style={{ background: `linear-gradient(90deg, ${NAVY}, ${SKY})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Inteligencia Artificial</span>{' '}a tu Ritmo
          </h1>

          {/* Breve descripción */}
          <p className="body-text" style={{ fontSize: '1.0625rem', marginBottom: '2.25rem', maxWidth: 470, color: TEXT }}>
            La escuela que analiza tu perfil, evalúa tus pre-requisitos y genera un roadmap estadístico 100% personalizado. Sin lagunas, sin saltos.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {authed
              ? <>
                  {/* Botón de Evaluación de pre requisito y de Cargar CV para el roadmap */}
                  <button className="btn-gold" style={{ fontSize: '0.9375rem', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: 8 }}>⚡ Evaluar Pre-Requisitos</button>
                  <button className="btn-navy" style={{ fontSize: '0.9375rem', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: 8 }}>📄 Cargar CV para Roadmap</button>
                </>
              : <>
                <LockedButton label="Evaluar Pre-Requisitos" icon="⚡" onClick={onAuthRequired} style={{ fontSize: '0.9375rem', padding: '0.875rem 2rem' }} />
                <LockedButton label="Cargar CV para Roadmap" icon="📄" onClick={onAuthRequired} style={{ fontSize: '0.9375rem', padding: '0.875rem 2rem', background: 'transparent', color: NAVY, border: `2px solid ${NAVY}`, boxShadow: 'none' }} />
                </>
            }
          </div>

          {/* Estadísticas principales de la Escuela */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {statsData.map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.5rem', color: NAVY }}>{num}</div>
                <div style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: MUTED }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de Roadmap */}
        <div className="enei-card" style={{ padding: '1.75rem', boxShadow: '0px 8px 32px rgba(48,64,111,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.375rem' }}>
            <div>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.9375rem', color: NAVY }}>Tu Roadmap Estadístico IA</div>
              <div style={{ color: MUTED, fontSize: '0.775rem', marginTop: 2 }}>Generado desde tu perfil académico</div>
            </div>
            <span className="badge-gold">EN CURSO</span>
          </div>
          <div style={{ marginBottom: '1.625rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: MUTED, fontSize: '0.78rem' }}>Progreso general</span>
              <span style={{ color: SKY, fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.85rem' }}>40%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: '40%' }} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {roadmapSteps.map((step, i) => (
              <div key={step.label} onClick={() => setActiveStep(i)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', borderRadius: 10, background: step.active ? '#EBF4FB' : 'transparent', border: `1px solid ${step.active ? 'rgba(110,167,218,0.45)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.18s' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: step.done ? '#22C55E' : step.active ? NAVY : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.done ? <span style={{ color: '#FFF', fontSize: '0.8rem' }}>✓</span> : <span style={{ color: step.active ? GOLD : MUTED, fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.75rem' }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.84rem', color: step.active ? NAVY : step.done ? '#64748B' : '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.label}</div>
                  <div style={{ fontSize: '0.7rem', color: step.active ? SKY : MUTED }}>{step.sub}</div>
                </div>
                {step.done && <span style={{ color: '#22C55E', fontSize: '0.75rem' }}>●</span>}
                {step.active && <span className="badge-sky">Activo</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', padding: '0.875rem', borderRadius: 10, background: '#F8FAFC', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>✦</div>
            <div>
              <div style={{ color: NAVY, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Montserrat' }}>Agente ENEI recomienda:</div>
              <div style={{ color: TEXT, fontSize: '0.75rem' }}>Practica 3 ejercicios de probabilidad antes de continuar</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}