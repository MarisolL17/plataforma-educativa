import React, { useState } from 'react'
import { NAVY, NAVY_D, GOLD } from '../../constants/colors'

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const cols: [string, string[]][] = [
    ['Plataforma', ['Catálogo de Cursos', 'Rutas Estadísticas', 'Evaluador IA', 'Roadmap por CV', 'Certificaciones ENEI']],
    ['Institución', ['Acerca de ENEI', 'Plana Docente', 'Investigación', 'Publicaciones', 'Trabaja con nosotros']],
    ['Soporte', ['Centro de Ayuda', 'Documentación API', 'Estado del Sistema', 'Privacidad', 'Términos de Uso']],
  ]

  const socialLinks = ['LinkedIn', 'YouTube', 'Twitter/X', 'GitHub']

  return (
    <footer style={{ background: NAVY_D, color: '#FFF', padding: '3.5rem 1.5rem 2rem', borderTop: `3px solid ${GOLD}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: NAVY, fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1rem' }}>E</span>
              </div>
              <div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1rem', color: '#FFF' }}>ENEI</div>
                <div style={{ fontFamily: 'Poppins', fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)' }}>Escuela de Estadística</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Formando estadísticos de excelencia con IA, metodología rigurosa y aprendizaje adaptativo.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, padding: '0.375rem 0.875rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
              <span style={{ color: '#86EFAC', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Montserrat' }}>Agente IA Conectado v1.0</span>
            </div>
          </div>

          {/* Columnas de Navegación */}
          {cols.map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.875rem', color: '#FFF', marginBottom: '1rem' }}>
                {title}
              </div>
              {links.map((link) => (
                <div key={link} style={{ marginBottom: '0.5rem' }}>
                  <a
                    href="#"
                    onMouseEnter={() => setHoveredLink(link)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      color: hoveredLink === link ? '#FFF' : 'rgba(255,255,255,0.55)',
                      fontSize: '0.84rem',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease-in-out',
                    }}
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Separador e Inferior */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} ENEI · Escuela Nacional de Estadística e Informática. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#"
                onMouseEnter={() => setHoveredSocial(social)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  color: hoveredSocial === social ? GOLD : 'rgba(255,255,255,0.45)',
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease-in-out',
                }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}