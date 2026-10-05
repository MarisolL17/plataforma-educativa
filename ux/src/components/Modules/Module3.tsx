import { useState } from 'react';
import { NAVY, SKY, GOLD, GOLD_D, TEXT, MUTED, BORDER, SHADOW } from '../../constants/colors';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface MensajeChat {
  r: 'user' | 'ai';
  t: string;
  start_seconds?: number;
}

export function Module3() {
  // 1. ID de tu video de YouTube
  const YOUTUBE_VIDEO_ID = '3VsBQkDm_4o';
  const DURACION_TOTAL_SEGUNDOS = 8940; // 2h 29m de la clase

  const [chatVal, setChatVal] = useState('');
  const [msgs, setMsgs] = useState<MensajeChat[]>([
    { r: 'ai', t: 'Hola, soy el asistente ENEI. ¿Tienes dudas sobre las fórmulas o conceptos de esta clase de Diseños Muestrales?' },
  ]);
  const [pos, setPos] = useState(0);

  // Flashcard inicial
  const [flashcard, setFlashcard] = useState<{ titulo: string; contenido: string } | null>({
    titulo: 'Muestreo Aleatorio Simple (MAS)',
    contenido: 'Procedimiento donde cada muestra posible del mismo tamaño tiene igual probabilidad de ser seleccionada.'
  });

  // Marcadores temáticos extraídos de la clase
  const ts = [
    { p: 2,  s: 191,  t: '3:11',   l: 'Muestreo aleatorio simple' },
    { p: 9,  s: 821,  t: '13:41',  l: 'Probabilidad de inclusión y pesos' },
    { p: 29, s: 2603, t: '43:23',  l: 'Fracción de muestreo' },
    { p: 31, s: 2770, t: '46:10',  l: 'Error relativo de muestreo (ERM)' },
    { p: 36, s: 3254, t: '54:14',  l: 'Varianza estimada del estimador' },
    { p: 43, s: 3836, t: '1:03:56',l: 'Práctica en Excel' },
    { p: 64, s: 5726, t: '1:35:26',l: 'Intervalos de confianza' },
  ];

  // Función para ordenar al iframe de YouTube saltar al segundo exacto
  const saltarAlSegundo = (segundos: number) => {
    const iframe = document.getElementById('yt-player') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [segundos, true]
        }),
        '*'
      );
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'playVideo',
          args: []
        }),
        '*'
      );
      setPos(Math.round((segundos / DURACION_TOTAL_SEGUNDOS) * 100));
    }
  };

  const formatearTiempo = (segundos: number) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = Math.floor(segundos % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const send = async () => {
    const pregunta = chatVal.trim();
    if (!pregunta) return;

    setMsgs(m => [...m, { r: 'user', t: pregunta }]);
    setChatVal('');
    setMsgs(m => [...m, { r: 'ai', t: 'Consultando con el material de la clase...' }]);

    try {
      const res = await fetch(`${API_URL}/chatbot/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      const textoRespuesta = data.respuesta_chat || data.respuesta || JSON.stringify(data);

      if (data.flashcard && data.flashcard.contenido) {
        setFlashcard({
          titulo: data.flashcard.titulo || 'Concepto clave identificado',
          contenido: data.flashcard.contenido
        });
      }

      if (data.start_seconds !== undefined) {
        saltarAlSegundo(data.start_seconds);
      }

      setMsgs(m => [
        ...m.slice(0, -1),
        { r: 'ai', t: textoRespuesta, start_seconds: data.start_seconds }
      ]);
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      setMsgs(m => [...m.slice(0, -1), { r: 'ai', t: 'Error: No se pudo conectar con el servidor local.' }]);
    }
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
          {/* Contenedor del Reproductor de YouTube */}
          <div className="enei-card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ aspectRatio: '16/9', position: 'relative', background: '#000' }}>
              <iframe
                id="yt-player"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&rel=0`}
                title="Clase ENEI: Diseños Muestrales Básicos"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div style={{ padding: '1rem 1.25rem' }}>
              {/* Barra de progreso interactiva */}
              <div
                style={{ position: 'relative', height: 22, marginBottom: '0.875rem', cursor: 'pointer' }}
                onClick={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const clickPorcentaje = (e.clientX - r.left) / r.width;
                  const seg = Math.round(clickPorcentaje * DURACION_TOTAL_SEGUNDOS);
                  saltarAlSegundo(seg);
                }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, right: 0, height: 5, background: '#E2E8F0', borderRadius: 3 }}>
                  <div style={{ width: `${pos}%`, height: '100%', background: `linear-gradient(90deg, ${SKY}, ${NAVY})`, borderRadius: 3, transition: 'width 0.2s' }} />
                </div>
                {ts.map(t => (
                  <div
                    key={t.p}
                    title={`${t.t} - ${t.l}`}
                    onClick={e => {
                      e.stopPropagation();
                      saltarAlSegundo(t.s);
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${t.p}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: pos >= t.p ? GOLD : '#FFF',
                      border: `2px solid ${pos >= t.p ? GOLD_D : SKY}`,
                      cursor: 'pointer',
                      boxShadow: SHADOW,
                      zIndex: 2,
                    }}
                  />
                ))}
              </div>

              {/* Botones de Marcadores Temáticos */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ts.map(t => (
                  <button
                    key={t.p}
                    onClick={() => saltarAlSegundo(t.s)}
                    style={{
                      background: Math.abs(pos - t.p) < 4 ? '#EBF4FB' : '#F8FAFC',
                      border: `1px solid ${Math.abs(pos - t.p) < 4 ? SKY : BORDER}`,
                      color: Math.abs(pos - t.p) < 4 ? NAVY : MUTED,
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <span style={{ color: SKY, fontSize: '0.55rem' }}>●</span>
                    {t.t} {t.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chatbot Asistente ENEI */}
          <div className="enei-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: 560, padding: 0, overflow: 'hidden' }}>
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
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.r === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '87%', padding: '0.625rem 0.875rem', borderRadius: m.r === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: m.r === 'user' ? NAVY : '#F1F5F9', color: m.r === 'user' ? '#FFF' : TEXT, fontSize: '0.8125rem', lineHeight: 1.55, border: m.r === 'ai' ? `1px solid ${BORDER}` : 'none' }}>
                    {m.t}
                  </div>
                  {/* Botón interactivo para saltar al segundo citado */}
                  {m.start_seconds !== undefined && (
                    <button
                      onClick={() => saltarAlSegundo(m.start_seconds!)}
                      style={{
                        marginTop: 6,
                        background: '#FEF7E6',
                        border: `1px solid rgba(250,191,56,0.6)`,
                        color: NAVY,
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                      ▶ Ver segmento ({formatearTiempo(m.start_seconds)})
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Flashcard Dinámica */}
            {flashcard && (
              <div style={{ margin: '0 1rem', padding: '0.75rem', background: '#FEF7E6', border: `1px solid rgba(250,191,56,0.4)`, borderRadius: 10, marginBottom: '0.75rem' }}>
                <div style={{ color: NAVY, fontSize: '0.68rem', fontWeight: 800, fontFamily: 'Montserrat', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                  📎 {flashcard.titulo}
                </div>
                <div style={{ color: TEXT, fontSize: '0.775rem', lineHeight: 1.55 }}>
                  {flashcard.contenido}
                </div>
              </div>
            )}

            <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8 }}>
              <input
                className="input-light"
                style={{ flex: 1, fontSize: '0.8125rem' }}
                placeholder="Pregunta sobre el video..."
                value={chatVal}
                onChange={e => setChatVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
              />
              <button onClick={send} className="btn-gold" style={{ padding: '0.625rem 0.875rem', flexShrink: 0 }}>↑</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}