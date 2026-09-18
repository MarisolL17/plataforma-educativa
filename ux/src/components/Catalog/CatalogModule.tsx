// src/components/Catalog/CatalogModule.tsx
import { useEffect, useState } from 'react';
import { obtenerProgramas, obtenerProgramaPorCodigo, Programa } from '../../services/api';
import { NAVY, SKY2, TEXT, MUTED, BORDER } from '../../constants/colors';

// ─── COMPONENTE REUTILIZABLE: MODAL DE DETALLES DEL CURSO ───────────────────
export interface CourseDetailModalProps {
  selectedPrograma: Programa;
  onClose: () => void;
  onSeleccionarParaEvaluacion?: (programa: Programa) => void;
}

export function CourseDetailModal({ 
  selectedPrograma, 
  onClose, 
  onSeleccionarParaEvaluacion 
}: CourseDetailModalProps) {
  if (!selectedPrograma) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', zIndex: 1000
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '16px', maxWidth: '750px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Encabezado del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span className="badge-sky">{selectedPrograma.tipo || 'PROGRAMA'}</span>
            <h2 style={{ fontSize: '1.5rem', color: NAVY, marginTop: '0.5rem', fontFamily: 'Montserrat' }}>
              {selectedPrograma.titulo}
            </h2>
            <div style={{ fontSize: '0.85rem', color: MUTED }}>
              Código: {selectedPrograma.codigo} | Duración Total: {selectedPrograma.duracion || 'Por definir'}
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: MUTED }}
          >
            ✕
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${BORDER}`, margin: '1rem 0' }} />

        {/* Cuerpo con la información completa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: '#334155' }}>
          
          {/* Descripción */}
          {selectedPrograma.descripcion && (
            <div>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.25rem' }}>Descripción:</strong>
              <p style={{ margin: 0 }}>{selectedPrograma.descripcion}</p>
            </div>
          )}

          {/* Módulos / Plan de Estudios */}
          {selectedPrograma.plan_de_estudios && selectedPrograma.plan_de_estudios.length > 0 && (
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 10, border: `1px solid ${BORDER}` }}>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                📚 Módulos / Cursos del Plan de Estudios:
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPrograma.plan_de_estudios.map((curso, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: '#FFFFFF', 
                      padding: '0.65rem 0.85rem', 
                      borderRadius: 6, 
                      border: `1px solid ${BORDER}`,
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ color: NAVY, fontWeight: 600 }}>{curso.nombre_curso}</span>
                    </div>
                    <span style={{ color: MUTED, fontWeight: 500 }}>{curso.horas} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objetivo General */}
          {selectedPrograma.objetivo_general && (
            <div>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.25rem' }}>Objetivo General:</strong>
              <p style={{ margin: 0 }}>{selectedPrograma.objetivo_general}</p>
            </div>
          )}

          {/* Objetivos Específicos */}
          {selectedPrograma.objetivos_especificos && (
            <div>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.5rem' }}>
                Objetivos Específicos:
              </strong>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '0.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.4rem',
                listStyleType: 'disc',
                listStylePosition: 'inside'
              }}>
                {selectedPrograma.objetivos_especificos
                  .split('•')
                  .map(p => p.trim())
                  .filter(p => p.length > 0)
                  .map((punto, i) => (
                    <li 
                      key={i} 
                      style={{ 
                        lineHeight: '1.5',
                        color: TEXT,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: SKY2, fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.2' }}>•</span>
                      <span style={{ flex: 1 }}>{punto}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Contenido Temático */}
          {selectedPrograma.contenido_tematico && (
            <div>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.5rem' }}>
                Contenido Temático:
              </strong>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '0.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.4rem',
                listStyleType: 'disc',
                listStylePosition: 'inside'
              }}>
                {selectedPrograma.contenido_tematico
                  .split('•')
                  .map(p => p.trim())
                  .filter(p => p.length > 0)
                  .map((punto, i) => (
                    <li 
                      key={i} 
                      style={{ 
                        lineHeight: '1.5',
                        color: TEXT,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: SKY2, fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.2' }}>•</span>
                      <span style={{ flex: 1 }}>{punto}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Pre-Requisitos */}
          {selectedPrograma.prerequisitos && (
            <div>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.25rem' }}>Pre-Requisitos:</strong>
              <p style={{ margin: 0 }}>{selectedPrograma.prerequisitos}</p>
            </div>
          )}

          {/* Resultados Esperados */}
          {selectedPrograma.resultados_esperados && (
            <div>
              <strong style={{ color: NAVY, display: 'block', marginBottom: '0.25rem' }}>Resultados Esperados:</strong>
              <p style={{ margin: 0 }}>{selectedPrograma.resultados_esperados}</p>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            className="btn-gold"
            onClick={() => {
              if (onSeleccionarParaEvaluacion) {
                onSeleccionarParaEvaluacion(selectedPrograma);
              }
            }}
            style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
          >
            ⚡ Evaluar Pre-Requisitos
          </button>

          <button 
            onClick={onClose}
            style={{ 
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              borderRadius: '8px',
              cursor: 'pointer',
              color: MUTED 
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL DEL CATÁLOGO ──────────────────────────────────────────
export function CatalogModule({ onSeleccionarParaEvaluacion }: { onSeleccionarParaEvaluacion?: (programa: Programa) => void }) {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [activeTab, setActiveTab] = useState<'Especialización' | 'Curso' | 'Taller'>('Especialización');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPrograma, setSelectedPrograma] = useState<Programa | null>(null);

  const handleOpenModal = async (programaBase: Programa) => {
    try {
      setSelectedPrograma(programaBase);
      const detalleCompleto = await obtenerProgramaPorCodigo(programaBase.codigo);
      setSelectedPrograma(detalleCompleto);
    } catch (err) {
      console.error("Error cargando detalles del programa:", err);
    }
  };

  const handleAbrirEvaluacionDirecta = (programa: Programa) => {
    if (onSeleccionarParaEvaluacion) {
      onSeleccionarParaEvaluacion(programa);
    }
    setSelectedPrograma(null);
    
    const modulo2Element = document.getElementById('evaluador-modulo-2');
    if (modulo2Element) {
      modulo2Element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    obtenerProgramas()
      .then((data) => {
        setProgramas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar programas desde BD:", err);
        setLoading(false);
      });
  }, []);

  const programasFiltrados = programas.filter(p => 
    p.tipo?.toLowerCase().includes(activeTab.toLowerCase())
  );

  return (
    <section style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', color: NAVY, fontFamily: 'Montserrat', fontWeight: 800 }}>
          Catálogo Académico
        </h2>
        <p style={{ color: MUTED }}>Explora nuestras líneas de capacitación especializadas</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        {(['Especialización', 'Curso', 'Taller'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '25px',
              border: `2px solid ${activeTab === tab ? SKY2 : BORDER}`,
              background: activeTab === tab ? SKY2 : 'transparent',
              color: activeTab === tab ? '#FFFFFF' : NAVY,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.95rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: MUTED }}>Cargando ofertas académicas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {programasFiltrados.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: MUTED, padding: '2rem' }}>
              No se encontraron programas registrados en la categoría "{activeTab}".
            </div>
          ) : (
            programasFiltrados.map((prog) => (
              <div 
                key={prog.codigo} 
                className="enei-card"
                onClick={() => handleOpenModal(prog)}
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${BORDER}`,
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge-sky" style={{ fontSize: '0.75rem' }}>{prog.tipo}</span>
                    <span style={{ fontSize: '0.8rem', color: MUTED, fontWeight: 600 }}>⏱ {prog.duracion}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: NAVY, fontFamily: 'Montserrat', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {prog.titulo}
                  </h3>
                  <p style={{ color: MUTED, fontSize: '0.875rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {prog.descripcion}
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: `1px solid ${BORDER}`, color: SKY2, fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Ver detalle completo</span>
                  <span>→</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPrograma && (
        <CourseDetailModal 
          selectedPrograma={selectedPrograma}
          onClose={() => setSelectedPrograma(null)}
          onSeleccionarParaEvaluacion={handleAbrirEvaluacionDirecta}
        />
      )}
    </section>
  );
}