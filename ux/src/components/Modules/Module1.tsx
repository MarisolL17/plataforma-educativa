import React, { useState } from 'react';
import { NAVY, SKY, GOLD, GOLD_D, MUTED, BORDER } from '../../constants/colors';
import { LockedButton } from '../Common/LockedButton';
import { Backdrop } from '../Common/Backdrop';
import { Field } from '../Common/Field';
import { SelectField } from '../Common/SelectField';

interface Module1Props {
  authed: boolean;
  usuarioId?: number;
  onAuthRequired: () => void;
}

export function Module1({ authed, usuarioId = 1, onAuthRequired }: Module1Props) {
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab]             = useState<'manual' | 'pdf'>('manual');
  const [done, setDone]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState('');

  // Estado para la carga de CV en PDF
  const [pdfFile, setPdfFile]     = useState<File | null>(null);

  // Estados del Formulario Manual (Académico)
  const [nivel, setNivel]             = useState('');
  const [carrera, setCarrera]         = useState('');
  const [universidad, setUniversidad] = useState('');
  const [anioInicio, setAnioInicio]   = useState('');
  const [anioEgreso, setAnioEgreso]   = useState('');

  // Estados del Formulario Manual (Laboral)
  const [area, setArea]               = useState('');
  const [cargo, setCargo]             = useState('');
  const [anios, setAnios]             = useState('');
  const [skillsText, setSkillsText]   = useState(''); // Texto bruto ingresado por el usuario

  const defaultSkills = ['R', 'Python', 'SPSS', 'Excel', 'SQL', 'LaTeX'];

  // Obtener arreglo de habilidades filtradas
  const getSkillsList = () => {
    if (!skillsText.trim()) return defaultSkills;
    return skillsText.split(',').map(s => s.trim()).filter(Boolean);
  };

  const routes = [
    ['Estadístico de Datos', SKY, '7 meses', 8],
    ['Investigador Cuantitativo', NAVY, '9 meses', 10],
    ['Analista de Riesgo', GOLD_D, '6 meses', 7]
  ];

  const handleOpenModal = (selectedTab: 'manual' | 'pdf') => {
    setTab(selectedTab);
    setErr('');
    setShowModal(true);
  };

  // 1. Envío de CV en PDF
  const handleSubirPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setErr('Por favor selecciona un archivo PDF');
      return;
    }

    setErr('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch(`/api/v1/usuarios/${usuarioId}/cv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al procesar el archivo PDF');
      }

      const data = await response.json();
      
      if (data.skills_detectadas) {
        setSkillsText(data.skills_detectadas);
      }

      setLoading(false);
      setShowModal(false);
      setDone(true);
    } catch (error: any) {
      setLoading(false);
      setErr(error?.message || 'Error al conectar con el servidor');
    }
  };

  // 2. Envío del Formulario Manual
  const handleCompletarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nivel || !carrera || !universidad || !area) {
      setErr('Por favor completa los campos académicos y laborales obligatorios');
      return;
    }

    setErr('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/completar-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          academico: {
            nivel,
            carrera,
            universidad,
            anio_inicio: parseInt(anioInicio) || null,
            anio_egreso: parseInt(anioEgreso) || null
          },
          laboral: {
            area_trabajo: area,
            cargo_actual: cargo,
            anios_experiencia: anios,
            skills: skillsText
          }
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar la información de tu perfil');
      }

      setLoading(false);
      setShowModal(false);
      setDone(true);
    } catch (error: any) {
      setLoading(false);
      setErr(error?.message || 'Error al guardar los datos');
    }
  };

  const currentSkills = getSkillsList();

  return (
    <section className="section-white" style={{ padding: '5rem 1.5rem', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge-navy" style={{ marginBottom: '1rem', display: 'inline-block' }}>MÓDULO 1</span>
          <h2 className="h-section" style={{ fontSize: 'clamp(1.625rem, 2.8vw, 2.25rem)', marginBottom: 10 }}>
            Roadmap Personalizado de Aprendizaje
          </h2>
          <p className="muted-text" style={{ fontSize: '0.9375rem', maxWidth: 580, margin: '0 auto' }}>
            Generamos una ruta de cursos a medida completando tu perfil profesional o subiendo tu CV.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }} className="two-col">
          
          {/* Columna Izquierda: Tarjeta de Acciones */}
          <div className="enei-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EBF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {done ? '🎓' : '📄'}
              </div>
              <div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: NAVY }}>
                  {done ? 'Perfil Actualizado' : 'Ingresa tu CV o Perfil'}
                </h3>
                <span style={{ color: MUTED, fontSize: '0.8rem' }}>
                  {done ? 'Información verificada para la ruta' : 'Elige cómo ingresar tus datos'}
                </span>
              </div>
            </div>

            {done ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FAFCFF', padding: '1rem', borderRadius: 8, border: `1px solid ${BORDER}` }}>
                {carrera && <div><strong>Carrera:</strong> {carrera} ({nivel})</div>}
                {universidad && <div><strong>Universidad:</strong> {universidad}</div>}
                {area && <div><strong>Área Laboral:</strong> {area}</div>}
                {skillsText && <div><strong>Skills registradas:</strong> {skillsText}</div>}
                {pdfFile && <div><strong>CV Cargado:</strong> {pdfFile.name}</div>}

                <button 
                  onClick={() => handleOpenModal('manual')} 
                  style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: SKY, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', textDecoration: 'underline' }}
                >
                  ✏️ Modificar datos o actualizar CV
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: MUTED, fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Llena el formulario con tus datos para diseñar tu ruta personalizada, o sube tu Curriculum Vitae en formato PDF para que la plataforma lo analice.
                </p>

                {/* BOTONES SEPARADOS */}
                {authed ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Botón Principal: Llenado Manual */}
                    <button 
                      className="btn-gold" 
                      style={{ width: '100%', justifyContent: 'center' }} 
                      onClick={() => handleOpenModal('manual')}
                    >
                      📋 Completar Perfil Manualmente
                    </button>

                    {/* Botón Secundario: Cargar CV PDF */}
                    <button 
                      className="btn-navy-outline" 
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center', 
                        padding: '0.75rem 1rem', 
                        border: `1.5px solid ${NAVY}`, 
                        borderRadius: 8, 
                        background: 'transparent', 
                        color: NAVY, 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }} 
                      onClick={() => handleOpenModal('pdf')}
                    >
                      📁 Cargar CV en formato PDF
                    </button>
                  </div>
                ) : (
                  <LockedButton label="Ingresar Datos (Inicia Sesión)" icon="🔒" onClick={onAuthRequired} style={{ width: '100%', justifyContent: 'center' }} />
                )}
              </div>
            )}
          </div>

          {/* Columna Derecha: Bloque de Habilidades Detectadas y Rutas */}
          <div className="enei-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✦</div>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 700, color: NAVY }}>Habilidades Detectadas</span>
            </div>

            {/* BLOQUE DE HABILIDADES DETECTADAS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {currentSkills.map((s, i) => (
                <span 
                  key={`${s}-${i}`} 
                  style={{ 
                    background: done ? 'rgba(34,197,94,0.1)' : '#F1F5F9', 
                    border: `1px solid ${done ? 'rgba(34,197,94,0.4)' : BORDER}`, 
                    color: done ? '#16A34A' : MUTED, 
                    padding: '4px 12px', 
                    borderRadius: 999, 
                    fontSize: '0.78rem', 
                    fontWeight: 600, 
                    fontFamily: 'Poppins', 
                    transition: 'all 0.35s', 
                    transitionDelay: `${i * 70}ms` 
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* RUTAS RECOMENDADAS */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.25rem' }}>
              <div style={{ color: MUTED, fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 500 }}>
                Rutas recomendadas · {done ? '3 generadas' : 'Ingresa tus datos para desbloquear'}
              </div>
              {routes.map(([title, color, dur, n]) => (
                <div key={title as string} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.625rem 0', borderBottom: `1px solid rgba(110,167,218,0.15)`, opacity: done ? 1 : 0.5 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: color as string, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontFamily: 'Montserrat', fontWeight: 600, fontSize: '0.84rem', color: NAVY }}>{title as string}</div>
                  <div style={{ color: MUTED, fontSize: '0.73rem' }}>{n} cursos · {dur as string}</div>
                  <div style={{ background: (color as string) + '22', border: `1px solid ${color}55`, color: color as string, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>→</div>
                </div>
              ))}
            </div>

            {!done && authed && (
              <div style={{ marginTop: '1.25rem' }}>
                <button className="btn-navy" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleOpenModal('manual')}>
                  Ver mi Roadmap
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODAL DE CÓMO APORTAR INFORMACIÓN */}
      {showModal && (
        <>
          <Backdrop onClose={() => setShowModal(false)} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
            <div 
              className="enei-card" 
              onClick={e => e.stopPropagation()} 
              style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', padding: '2.25rem', pointerEvents: 'all', position: 'relative' }}
            >
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', color: MUTED }}>
                ×
              </button>

              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.25rem', color: NAVY, marginBottom: '0.25rem' }}>
                Genera tu Roadmap Personalizado
              </h2>
              <p style={{ color: MUTED, fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                Elige el método de tu preferencia para analizar tus antecedentes.
              </p>

              {/* Tabs internas del Modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#F1F5F9', padding: 4, borderRadius: 8, marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setTab('manual'); setErr(''); }}
                  style={{ padding: '0.5rem', borderRadius: 6, border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: tab === 'manual' ? '#FFFFFF' : 'transparent', color: tab === 'manual' ? NAVY : MUTED, boxShadow: tab === 'manual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  📝 Formulario Manual
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('pdf'); setErr(''); }}
                  style={{ padding: '0.5rem', borderRadius: 6, border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: tab === 'pdf' ? '#FFFFFF' : 'transparent', color: tab === 'pdf' ? NAVY : MUTED, boxShadow: tab === 'pdf' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  📄 Subir CV (PDF)
                </button>
              </div>

              {err && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.625rem', color: '#DC2626', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {err}
                </div>
              )}

              {/* OPCIÓN 1: FORMULARIO MANUAL */}
              {tab === 'manual' && (
                <form onSubmit={handleCompletarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: '1rem' }}>
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '0.9rem', color: NAVY, marginBottom: '0.75rem' }}>1. Información Académica</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <SelectField label="Nivel de estudios *" value={nivel} onChange={setNivel} options={['Bachillerato', 'Licenciatura / Pregrado', 'Especialización', 'Maestría', 'Doctorado', 'Otro']} />
                      <Field label="Carrera / Especialidad *" placeholder="Estadística, Economía, Ingeniería..." value={carrera} onChange={setCarrera} />
                      <Field label="Universidad / Instituto *" placeholder="Universidad Nacional Mayor de San Marcos" value={universidad} onChange={setUniversidad} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <Field label="Año Inicio" placeholder="2018" value={anioInicio} onChange={setAnioInicio} />
                        <Field label="Año Egreso" placeholder="2023" value={anioEgreso} onChange={setAnioEgreso} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '0.9rem', color: NAVY, marginBottom: '0.75rem' }}>2. Perfil Profesional</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <SelectField label="Área de trabajo *" value={area} onChange={setArea} options={['Estadística / Análisis de Datos', 'Investigación', 'Banca y Finanzas', 'Salud / Epidemiología', 'Educación', 'Sector Público', 'Tecnología / Software', 'Otro']} />
                      <Field label="Cargo actual" placeholder="Analista de Datos Senior" value={cargo} onChange={setCargo} />
                      <SelectField label="Años de experiencia" value={anios} onChange={setAnios} options={['Sin experiencia', 'Menos de 1 año', '1 – 3 años', '3 – 5 años', '5 – 10 años', 'Más de 10 años']} />
                      
                      {/* Campo Habilidades Técnicas con Preview de Badges en Tiempo Real */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <label style={{ fontFamily: 'Poppins', fontSize: '0.8125rem', fontWeight: 600, color: NAVY }}>Habilidades técnicas clave</label>
                        <input 
                          className="input-light" 
                          style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: `1px solid ${BORDER}`, fontFamily: 'Poppins', fontSize: '0.85rem' }} 
                          placeholder="R, Python, SPSS, Excel, SQL, Stata..." 
                          value={skillsText} 
                          onChange={e => setSkillsText(e.target.value)} 
                        />
                        <span style={{ color: MUTED, fontSize: '0.72rem' }}>Separa las habilidades con comas</span>
                        
                        {/* Previsualización en vivo de Badges */}
                        {skillsText.trim() && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: 6 }}>
                            {skillsText.split(',').filter(s => s.trim()).map((s, idx) => (
                              <span key={idx} className="badge-sky" style={{ fontSize: '0.72rem' }}>{s.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  <button type="submit" className="btn-gold" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', opacity: loading ? 0.75 : 1 }} disabled={loading}>
                    {loading ? 'Generando Roadmap...' : '✓ Guardar y Generar mi Roadmap'}
                  </button>
                </form>
              )}

              {/* OPCIÓN 2: SUBIR CV EN PDF */}
              {tab === 'pdf' && (
                <form onSubmit={handleSubirPDF} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ border: `2px dashed ${SKY}`, borderRadius: 12, padding: '2rem', textAlign: 'center', background: '#FAFCFF', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📤</div>
                    <p style={{ fontWeight: 600, color: NAVY, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      {pdfFile ? pdfFile.name : 'Haz clic para seleccionar tu CV (PDF)'}
                    </p>
                    <span style={{ color: MUTED, fontSize: '0.78rem' }}>Formato permitido: solo archivos .pdf (Máx. 5MB)</span>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                    />
                  </div>

                  <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.75 : 1 }} disabled={loading}>
                    {loading ? 'Analizando CV con IA...' : '✓ Procesar CV y Crear Roadmap'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </>
      )}
    </section>
  );
}