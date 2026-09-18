import { NAVY, MUTED, BORDER } from '../../constants/colors';

export const testimonials = [
  { name: 'Valentina Cruz',   role: 'Estadística en el INE',       text: 'El evaluador de pre-requisitos fue clave. Empecé exactamente donde debía y avancé con una base sólida, sin brechas de conocimiento.', skills: ['R', 'Inferencia', 'Muestreo'],         rating: 5, avatar: 'photo-1494790108377-be9c29b29330' },
  { name: 'Rodrigo Espinoza', role: 'Analista @ Banco Central',    text: 'El roadmap generado desde mi CV fue increíblemente preciso. En 4 meses pasé de junior a liderar el área de modelos de riesgo.', skills: ['Python', 'GLM', 'Series de Tiempo'], rating: 5, avatar: 'photo-1507003211169-0a1dd7228f2d' },
  { name: 'Daniela Moreno',   role: 'Investigadora @ U. de Chile', text: 'El chatbot de video revolucionó mi aprendizaje. Pauso, pregunto, y en segundos tengo la respuesta con el segmento exacto.', skills: ['Bayesiana', 'Stan', 'Visualización'], rating: 5, avatar: 'photo-1438761681033-6461ffad8d80' },
];

export function Testimonials() {
  return (
    <section className="section-alt" style={{ padding: '5rem 1.5rem', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="h-section" style={{ fontSize: 'clamp(1.625rem, 2.8vw, 2.125rem)', marginBottom: 8 }}>Lo que dicen nuestros estudiantes</h2>
          <p className="muted-text" style={{ fontSize: '0.9375rem' }}>Estadísticos de todo Latinoamérica que transformaron sus carreras con ENEI</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="enei-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                  <img src={`https://images.unsplash.com/${t.avatar}?w=100&h=100&fit=crop&auto=format`} alt={t.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.9rem', color: NAVY }}>{t.name}</div>
                    <div style={{ color: MUTED, fontSize: '0.75rem' }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ color: '#E5A91A', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color: MUTED, fontSize: '0.8375rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {t.skills.map(s => <span key={s} className="badge-sky" style={{ fontSize: '0.68rem' }}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}