// src/components/Modules/Module1_3.tsx
import React, { useState } from 'react';
import { NAVY, SKY, GOLD, GOLD_D, MUTED, BORDER } from '../../constants/colors';
import { LockedButton } from '../Common/LockedButton';
import { Backdrop } from '../Common/Backdrop';
import { PerfilView } from '../../pages/PerfilView';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface Module1Props {
  authed: boolean;
  usuarioId?: number | string;
  onAuthRequired: () => void;
}

export function Module1({ authed, usuarioId = 1, onAuthRequired }: Module1Props) {
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [loadingPdf, setLoadingPdf]         = useState(false);
  const [pdfData, setPdfData]               = useState<any>(null); // Guardará el JSON parseado por Gemini
  const [err, setErr]                       = useState('');
  const [done, setDone]                     = useState(false);

  const routes = [
    ['Estadístico de Datos', SKY, '7 meses', 8],
    ['Investigador Cuantitativo', NAVY, '9 meses', 10],
    ['Analista de Riesgo', GOLD_D, '6 meses', 7]
  ];

  // Handler para subir y procesar el CV PDF mediante la API de Gemini
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErr("Solo se permiten archivos en formato PDF.");
      return;
    }

    setLoadingPdf(true);
    setErr('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Petición al backend para extraer datos del PDF
      const response = await fetch(`${API_URL}/v1/auth/extraer_cv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al analizar el CV con la IA.');
      }

      const extractedJson = await response.json(); // Esquema CompletarPerfilSchema generado por la IA
      
      // Guardamos el JSON de Gemini e inyectamos a PerfilView
      setPdfData(extractedJson);
      setShowPerfilModal(true);

    } catch (error: any) {
      setErr(error.message || 'Ocurrió un error al procesar el archivo.');
    } finally {
      setLoadingPdf(false);
    }
  };

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
            Construimos una ruta estadística a medida ajustada a tu perfil y legajo personal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }} className="two-col">
          
          {/* Columna Izquierda: Opciones de Registro / Carga */}
          <div className="enei-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EBF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {done ? '🎓' : '📝'}
              </div>
              <div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: NAVY }}>
                  {done ? 'Perfil Actualizado' : 'Ingresa tu CV o Perfil Completo'}
                </h3>
                <span style={{ color: MUTED, fontSize: '0.8rem' }}>
                  {done ? 'Legajo guardado para la generación del roadmap' : 'Completa tu información personal, académica y laboral'}
                </span>
              </div>
            </div>

            {err && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.625rem', color: '#DC2626', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {err}
              </div>
            )}

            <div>
              <p style={{ color: MUTED, fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Puedes completar tu legajo ingresando los datos manualmente en tu perfil o subiendo tu Currículum Vitae en formato PDF para auto-completar los campos.
              </p>

              {authed ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {/* Opción 1: Abrir Modal Manual */}
                  <button 
                    className="btn-gold" 
                    style={{ width: '100%', justifyContent: 'center' }} 
                    onClick={() => {
                      setPdfData(null); // Limpiar datos de PDF para ingresar manualmente
                      setShowPerfilModal(true);
                    }}
                  >
                    📋 Completar Perfil Completo
                  </button>

                  {/* Opción 2: Subir PDF para IA */}
                  <label 
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
                      cursor: loadingPdf ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'center'
                    }}
                  >
                    {loadingPdf ? '⏳ Analizando CV con Gemini...' : '📁 Subir CV en formato PDF'}
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handlePdfUpload} 
                      disabled={loadingPdf}
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              ) : (
                <LockedButton label="Ingresar Datos (Inicia Sesión)" icon="🔒" onClick={onAuthRequired} style={{ width: '100%', justifyContent: 'center' }} />
              )}
            </div>
          </div>

          {/* Columna Derecha: Rutas Recomendadas */}
          <div className="enei-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✦</div>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 700, color: NAVY }}>Rutas Estadísticas Recomendadas</span>
            </div>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.25rem' }}>
              <div style={{ color: MUTED, fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 500 }}>
                {done ? 'Rutas generadas para tu perfil:' : 'Completa tu información para desbloquear tus rutas'}
              </div>
              {routes.map(([title, color, dur, n]) => (
                <div key={title as string} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 0', borderBottom: `1px solid rgba(110,167,218,0.15)`, opacity: done ? 1 : 0.5 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: color as string, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontFamily: 'Montserrat', fontWeight: 600, fontSize: '0.84rem', color: NAVY }}>{title as string}</div>
                  <div style={{ color: MUTED, fontSize: '0.73rem' }}>{n} cursos · {dur as string}</div>
                  <div style={{ background: (color as string) + '22', border: `1px solid ${color}55`, color: color as string, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>→</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* VENTANA MODAL POP-UP CON PERFILVIEW INTEGRADO */}
      {showPerfilModal && (
        <>
          <Backdrop onClose={() => setShowPerfilModal(false)} />
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            pointerEvents: 'none'
          }}>
            <div 
              className="enei-card"
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 1100,
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                pointerEvents: 'all',
                position: 'relative',
                background: '#FFFFFF',
                borderRadius: 16
              }}
            >
              {/* Botón para cerrar */}
              <button 
                onClick={() => setShowPerfilModal(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: '#F1F5F9',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 700,
                  zIndex: 10
                }}
              >
                ✕
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: SKY, textTransform: 'uppercase' }}>
                  SISTEMA DE LEGAJO INSTITUCIONAL
                </span>
                <h2 style={{ fontSize: '1.35rem', color: NAVY, marginTop: '0.25rem' }}>
                  {pdfData ? 'Verificación de datos procesados por IA' : 'Configuración del Perfil de Usuario'}
                </h2>
              </div>

              {/* RENDERIZADO DEL PERFIL COMPLETO */}
              <PerfilView 
                usuarioId={usuarioId}
                initialData={pdfData} // Datos de Gemini
                onVolver={() => {
                  setShowPerfilModal(false);
                  setDone(true); // Activa la visualización de rutas al completar
                }} 
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}