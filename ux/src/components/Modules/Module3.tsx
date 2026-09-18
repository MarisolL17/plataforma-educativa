import { useState } from 'react';
import { NAVY, SKY, GOLD, GOLD_D, TEXT, MUTED, BORDER, SHADOW } from '../../constants/colors';

export function Module3() {
  const [chatVal, setChatVal] = useState('');
  const [msgs, setMsgs] = useState([
    { r: 'ai',   t: 'Hola, soy el asistente ENEI. ¿Tienes preguntas sobre este módulo de estadística?' },
    { r: 'user', t: '¿Puedes explicarme qué es el intervalo de confianza?' },
    { r: 'ai',   t: 'El intervalo de confianza es un rango de valores que, con una probabilidad dada (ej: 95%), contiene el parámetro poblacional. En el video lo explican con ejemplos visuales entre los min 6:20 y 11:45. ¿Te muestro ese segmento?' },
  ]);
  const [pos, setPos] = useState(38);
  const ts = [
    { p: 12, t: '2:48',  l: 'Estimación puntual' },
    { p: 38, t: '6:20',  l: 'Intervalos de confianza' },
    { p: 62, t: '12:05', l: 'Prueba t de Student' },
    { p: 84, t: '18:22', l: 'Errores Tipo I y II' },
  ];

  const send = () => {
    if (!chatVal.trim()) return;
    setMsgs(m => [...m,
      { r: 'user', t: chatVal },
      { r: 'ai',   t: `Sobre "${chatVal}": Excelente pregunta estadística. Revisa el segmento del minuto 12:05 donde el Prof. Ramírez lo explica con ejemplos de datos reales y simulaciones.` }
    ]);
    setChatVal('');
  };

  return (
    <section className="section-white" style={{ padding: '5rem 1.5rem', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge-navy" style={{ marginBottom: '1rem', display: 'inline-block' }}>MÓDULO 3</span>
          <h2 className="h-section" style={{ fontSize: 'clamp(1.625rem, 2.8vw, 2.25rem)', marginBottom: 10 }}>Recordar lo Aprendido</h2>
          <p className="muted-text" style={{ fontSize: '0.9375rem' }}>Video con marcadores interactivos y chatbot IA que responde desde el contenido exacto del curso</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem' }} className="two-col">
          <div className="enei-card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ aspectRatio: '16/9', position: 'relative', background: '#EBF4FB', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=450&fit=crop&auto=format"
                alt="Clase: Inferencia Estadística" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(48,64,111,0.75))' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(48,64,111,0.25)', cursor: 'pointer', transition: 'transform 0.15s' }}>
                  <span style={{ fontSize: '1.5rem', marginLeft: 4, color: NAVY }}>▶</span>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, color: '#FFF', fontSize: '0.9375rem', marginBottom: 2 }}>Módulo 3: Inferencia y Pruebas de Hipótesis</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.775rem' }}>Prof. Eduardo Ramírez · Inferencia Estadística I</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem' }}>
              <div style={{ position: 'relative', height: 22, marginBottom: '0.875rem', cursor: 'pointer' }}
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setPos(Math.round(((e.clientX - r.left) / r.width) * 100)); }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, right: 0, height: 5, background: '#E2E8F0', borderRadius: 3 }}>
                  <div style={{ width: `${pos}%`, height: '100%', background: `linear-gradient(90deg, ${SKY}, ${NAVY})`, borderRadius: 3, transition: 'width 0.1s' }} />
                </div>
                {ts.map(t => (
                  <div key={t.p} title={t.l} onClick={e => { e.stopPropagation(); setPos(t.p); }}
                    style={{ position: 'absolute', top: '50%', left: `${t.p}%`, transform: 'translate(-50%, -50%)', width: 11, height: 11, borderRadius: '50%', background: pos === t.p ? GOLD : '#FFF', border: `2px solid ${pos === t.p ? GOLD_D : SKY}`, cursor: 'pointer', boxShadow: pos === t.p ? `0 0 0 3px rgba(250,191,56,0.3)` : SHADOW, transition: 'all 0.15s', zIndex: 2 }} />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  {['⏮', null, '⏭'].map((icon, i) => icon
                    ? <button key={i} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '1rem' }}>{icon}</button>
                    : <button key={i} style={{ background: NAVY, border: 'none', color: '#FFF', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.875rem' }}>▶</button>
                  )}
                  <span style={{ color: MUTED, fontSize: '0.75rem' }}>6:20 / 24:38</span>
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ color: MUTED, fontSize: '0.8rem', cursor: 'pointer' }}>🔊</span>
                  <span style={{ color: MUTED, fontSize: '0.75rem', cursor: 'pointer' }}>1×</span>
                  <span style={{ color: MUTED, fontSize: '0.8rem', cursor: 'pointer' }}>⛶</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ts.map(t => (
                  <button key={t.p} onClick={() => setPos(t.p)}
                    style={{ background: pos === t.p ? '#EBF4FB' : '#F8FAFC', border: `1px solid ${pos === t.p ? SKY : BORDER}`, color: pos === t.p ? NAVY : MUTED, padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: pos === t.p ? SKY : '#CBD5E1', fontSize: '0.55rem' }}>●</span>
                    {t.t} {t.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="enei-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: 530, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10, background: '#F8FAFC' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: GOLD }}>✦</div>
              <div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.875rem', color: NAVY }}>Asistente ENEI</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                  <span style={{ color: '#16A34A', fontSize: '0.68rem', fontWeight: 600 }}>En línea</span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.r === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '87%', padding: '0.625rem 0.875rem', borderRadius: m.r === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: m.r === 'user' ? NAVY : '#F1F5F9', color: m.r === 'user' ? '#FFF' : TEXT, fontSize: '0.8125rem', lineHeight: 1.55, border: m.r === 'ai' ? `1px solid ${BORDER}` : 'none' }}>
                    {m.t}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ margin: '0 1rem', padding: '0.75rem', background: '#FEF7E6', border: `1px solid rgba(250,191,56,0.4)`, borderRadius: 10, marginBottom: '0.75rem' }}>
              <div style={{ color: NAVY, fontSize: '0.68rem', fontWeight: 800, fontFamily: 'Montserrat', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>📎 Flashcard generada</div>
              <div style={{ color: TEXT, fontSize: '0.775rem', lineHeight: 1.55 }}>Intervalo de confianza 95%: rango construido tal que, en muestras repetidas, el 95% de los intervalos contiene el verdadero parámetro μ</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8 }}>
              <input className="input-light" style={{ flex: 1, fontSize: '0.8125rem' }} placeholder="Pregunta sobre el video..."
                value={chatVal} onChange={e => setChatVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
              <button onClick={send} className="btn-gold" style={{ padding: '0.625rem 0.875rem', flexShrink: 0 }}>↑</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}