import { useEffect, useState } from 'react';
import { CourseDetailModal } from '../Catalog/CatalogModule';
import { obtenerProgramas, generarExamen, calificarExamen, obtenerProgramaPorCodigo, Programa } from '../../services/api';
import { NAVY, SKY2, TEXT, MUTED, BORDER } from '../../constants/colors';
import { LockedButton } from '../Common/LockedButton';

export function Module2({ 
  authed, 
  onAuthRequired, 
  programaInicial, 
  onVerCursoSugerido 
}: { 
  authed: boolean; 
  onAuthRequired: () => void; 
  programaInicial: string; 
  onVerCursoSugerido?: (codigoCurso: string) => void; 
}) {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [programaSel, setProgramaSel] = useState<string>(programaInicial || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [started, setStarted] = useState<boolean>(false);
  const [examenData, setExamenData] = useState<any>(null);
  const [qIndex, setQIndex] = useState<number>(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<Record<string, string>>({});
  const [selOption, setSelOption] = useState<string | null>(null);

  const [resultadoFinal, setResultadoFinal] = useState<any>(null);

  // 1. Estado para controlar el programa seleccionado en el Modal
  const [cursoModalSel, setCursoModalSel] = useState<Programa | null>(null);

  useEffect(() => {
    if (programaInicial) {
      setProgramaSel(programaInicial);
      setStarted(false);         // Resetea el examen si había uno en curso
      setResultadoFinal(null);   // Resetea los resultados
    }
  }, [programaInicial]);

  useEffect(() => {
    obtenerProgramas()
      .then((data) => {
        setProgramas(data);
        if (data.length > 0 && !programaSel) setProgramaSel(data[0].titulo);
      })
      .catch(() => setErrorMsg("No se pudieron cargar los cursos desde el servidor."));
  }, []);

  // 2. Manejador para abrir el Modal cuando se presiona "Ver Curso →"
  const handleVerCursoSugerido = async (codigoCurso: string) => {
    if (onVerCursoSugerido) {
      onVerCursoSugerido(codigoCurso);
    } else {
      const cursoEncontrado = programas.find(p => p.codigo === codigoCurso || p.titulo === codigoCurso);
      if (cursoEncontrado) {
        try {
          // Intentamos obtener el detalle completo desde la API si existe
          const detalleCompleto = await obtenerProgramaPorCodigo(cursoEncontrado.codigo);
          setCursoModalSel(detalleCompleto);
        } catch {
          setCursoModalSel(cursoEncontrado);
        }
      }
    }
  };

  // 3. Callback cuando el usuario hace clic en "⚡ Evaluar Pre-Requisitos" DENTRO del Modal
  const handleSeleccionarParaEvaluacion = (programa: Programa) => {
    setProgramaSel(programa.titulo);
    setCursoModalSel(null);
    setStarted(false);
    setResultadoFinal(null);

    // Scroll suave hacia la tarjeta principal de evaluación
    const modulo2Element = document.getElementById('evaluador-modulo-2');
    if (modulo2Element) {
      modulo2Element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIniciarTest = async () => {
    const programaObjeto = programas.find(p => p.titulo === programaSel);
    if (!programaObjeto){
      setErrorMsg("Por favor, selecciona un programa válido.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const prerequisitosText = programaObjeto.prerequisitos || 'General';
      const contenidoText = programaObjeto.contenido_tematico || '';

      const silaboContexto = `TEMAS PRERREQUISITO A EVALUAR:\n${prerequisitosText}\n\nCONTENIDO TEMÁTICO:\n${contenidoText}`;
      
      const examenObtenido = await generarExamen(
        prerequisitosText,
        programaObjeto.titulo,
        silaboContexto
      );

      setExamenData(examenObtenido);
      setStarted(true);
      setQIndex(0);
      setRespuestasUsuario({});
      setResultadoFinal(null);
    } catch (err) {
      setErrorMsg("Ocurrió un error al generar el examen con la IA. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const preguntas = examenData?.examen?.preguntas || [];
  const preguntaActual = preguntas[qIndex];

  const handleSiguiente = async () => {
    if (!preguntaActual || selOption === null) return;

    const nuevasRespuestas = {
      ...respuestasUsuario,
      [String(preguntaActual.id)]: selOption
    };
    setRespuestasUsuario(nuevasRespuestas);
    setSelOption(null);

    if (qIndex + 1 < preguntas.length) {
      setQIndex(n => n + 1);
    } else {
      setLoading(true);
      try {
        const resultado = await calificarExamen(examenData, nuevasRespuestas);
        setResultadoFinal(resultado);
      } catch (err) {
        setErrorMsg("Error al procesar la calificación del examen.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section id="evaluador-modulo-2" className="section-alt" style={{ padding: '5rem 1.5rem', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge-gold" style={{ marginBottom: '1rem', display: 'inline-block' }}>MÓDULO 2</span>
          <h2 className="h-section" style={{ fontSize: 'clamp(1.625rem, 2.8vw, 2.25rem)', marginBottom: 10 }}>Evaluador de Pre-Requisitos</h2>
          <p className="muted-text" style={{ fontSize: '0.9375rem' }}>Test adaptativo impulsado por IA para calibrar tu nivel antes de comenzar</p>
        </div>

        <div className="enei-card" style={{ maxWidth: 720, margin: '0 auto', padding: '2rem', boxShadow: '0px 8px 32px rgba(48,64,111,0.10)' }}>
          {errorMsg && (
            <div style={{ padding: '1rem', background: '#FEE2E2', color: '#991B1B', borderRadius: 8, marginBottom: '1rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {!started && !resultadoFinal && (
            <div style={{ textAlign: 'center', padding: '1.75rem 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EBF4FB', border: `2px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '2rem' }}>🧠</div>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.25rem', color: NAVY, marginBottom: 8 }}>Test de Pre-Requisitos Académicos</div>
              
              <div style={{ margin: '1.5rem 0' }}>
                <label style={{ display: 'block', color: NAVY, fontWeight: 600, marginBottom: 8 }}>Selecciona un curso a evaluar:</label>
                <select 
                  value={programaSel} 
                  onChange={(e) => setProgramaSel(e.target.value)}
                  style={{ width: '100%', maxWidth: 400, padding: '0.75rem', borderRadius: 8, border: `1.5px solid ${SKY2}`, color: NAVY, background: '#FFFFFF', fontFamily: 'Poppins', outline: 'none' }}
                >
                  <option value="" disabled style={{ color: TEXT, backgroundColor: '#FFFFFF' }}></option>
                  {programas.map((c: any, i: number) => (
                    <option
                      key={i}
                      value={ c.nombre_curso || c.titulo || c.Título }
                      style={{ color: '#30406F', backgroundColor: '#FFFFFF', padding: '8px' }}
                    >
                      { c.nombre_curso || c.titulo || c.Título }
                    </option>
                  ))}
                </select>
              </div>

              {authed ? (
                <button
                  className="btn-gold" 
                  disabled={loading || programas.length === 0}
                  style={{ fontSize: '1rem', padding: '0.9rem 2.5rem', opacity: loading ? 0.7 : 1 }} 
                  onClick={handleIniciarTest}
                >
                  {loading ? 'Generando examen con IA...' : '⚡ Iniciar Test de Pre-Requisitos'}
                </button>
              ) : (
                <LockedButton
                  label="Iniciar Test de Pre-Requisitos"
                  onClick={onAuthRequired}
                  style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}
                />
              )}
            </div>
          )}

          {started && !resultadoFinal && preguntaActual && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: MUTED, fontSize: '0.75rem', marginBottom: 5 }}>
                    Pregunta {qIndex + 1} de {preguntas.length}
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${((qIndex + 1) / preguntas.length) * 100}%` }} />
                  </div>
                </div>
                <span className="badge-sky" style={{ fontSize: '0.75rem' }}>Nivel: {preguntaActual.nivel_bloom}</span>
              </div>

              <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1rem', color: NAVY, marginBottom: '1.25rem', lineHeight: 1.55 }}>
                {preguntaActual.id}. {preguntaActual.enunciado}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {Object.entries(preguntaActual.alternativas).map(([letra, textoOption]) => (
                  <button 
                    key={letra} 
                    onClick={() => setSelOption(letra)}
                    style={{ 
                      textAlign: 'left', 
                      padding: '0.875rem 1rem', 
                      borderRadius: 10, 
                      border: `1.5px solid ${selOption === letra ? SKY2 : BORDER}`, 
                      background: selOption === letra ? '#EBF4FB' : '#FFFFFF', 
                      color: selOption === letra ? NAVY : TEXT, 
                      fontFamily: 'Poppins', 
                      fontSize: '0.875rem', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12 
                    }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selOption === letra ? SKY2 : '#CBD5E1'}`, background: selOption === letra ? SKY2 : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selOption === letra && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <strong>{letra})</strong> {String(textoOption)}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button 
                  className="btn-gold" 
                  disabled={selOption === null || loading}
                  style={{ opacity: selOption === null || loading ? 0.55 : 1 }}
                  onClick={handleSiguiente}
                >
                  {loading ? 'Calificando...' : (qIndex + 1 === preguntas.length ? 'Finalizar y Calificar →' : 'Siguiente →')}
                </button>
              </div>
            </div>
          )}

          {resultadoFinal && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                {resultadoFinal.estado === 'APTO' ? '✅' : '❌'}
              </div>
              <h3 style={{ fontFamily: 'Montserrat', fontSize: '1.75rem', fontWeight: 800, color: NAVY, marginBottom: '0.5rem' }}>
                Estado: <span style={{ color: resultadoFinal.estado === 'APTO' ? '#16A34A' : '#DC2626' }}>{resultadoFinal.estado}</span>
              </h3>
              <p style={{ color: TEXT, margin: '0.5rem 0 1.5rem' }}>
                Puntaje obtenido: <strong>{resultadoFinal.puntaje_obtenido}</strong> de {preguntas.length} (Puntaje de corte: {resultadoFinal.puntaje_corte})
              </p>

              {resultadoFinal.resumen_por_nivel && (
                <div style={{ marginTop: '1.5rem', textAlign: 'left', background: '#F8FAFC', padding: '1rem', borderRadius: 10, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Desempeño por Nivel Cognitivo (Taxonomía de Bloom):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                    {resultadoFinal.resumen_por_nivel.map((item: any, idx: number) => (
                      <div key={idx} style={{ background: 'white', padding: '0.5rem', borderRadius: 6, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: MUTED }}>{item.nivel_bloom}</div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{item.correctas} / {item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendación de Cursos Sugeridos si es NO APTO */}
              {resultadoFinal.estado === 'NO APTO' && (
                <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                  <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: 8, marginBottom: '1.5rem', color: '#991B1B' }}>
                    ⚠️ Aún necesitas reforzar algunos conceptos clave antes de tomar este curso.
                  </div>
                  
                  <h4 style={{ color: NAVY, marginBottom: '0.75rem', fontFamily: 'Montserrat' }}>
                    📚 Cursos sugeridos para nivelar tus conocimientos:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {resultadoFinal.cursos_sugeridos?.map((cursoSugerido: any, idx: number) => (
                      <div key={idx} style={{ padding: '0.85rem', border: `1px solid ${BORDER}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{cursoSugerido.titulo}</strong>
                          <div style={{ fontSize: '0.8rem', color: MUTED }}>{cursoSugerido.descripcion_corta}</div>
                        </div>
                        <button 
                          className="badge-sky" 
                          style={{ cursor: 'pointer', border: 'none' }}
                          onClick={() => handleVerCursoSugerido(cursoSugerido.codigo || cursoSugerido.titulo)}
                        >
                          Ver Curso →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}              
            
              <div style={{ marginTop: '2rem'}}>
                <button 
                  className="btn-gold" 
                  onClick={() => { setStarted(false); setResultadoFinal(null); }}
                >
                  Realizar otra evaluación
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Renderizado condicional del modal cuando se selecciona un curso sugerido */}
      {cursoModalSel && (
        <CourseDetailModal 
          selectedPrograma={cursoModalSel}
          onClose={() => setCursoModalSel(null)}
          onSeleccionarParaEvaluacion={handleSeleccionarParaEvaluacion}
        />
      )}
    </section>
  );
}