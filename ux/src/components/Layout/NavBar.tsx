import { useEffect, useState } from 'react';
import { NAVY, NAVY_D, SKY, GOLD, TEXT, MUTED, BORDER } from '../../constants/colors';

// ─── Barra de cursos superior ─────────────────────────────────────────────
const navCats = ['Fundamentos', 'Inferencia', 'Modelado', 'Bayesiana', 'IA & Stats'];

interface NavBarProps {
  authed: boolean;
  userName: string;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onNavigatePerfil?: () => void;
}

export function NavBar({ authed, userName, onLogin, onRegister, onLogout, onNavigatePerfil }: NavBarProps) {
  const [search, setSearch] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const [nombreUsuario, setNombreUsuario] = useState('Usuario');

  useEffect(() => {
    // Obtener el nombre del usuario desde el localStorage
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.nombres) {
        const primerNombre = user.nombres.split(' ')[0]; // Obtener el primer nombre
        setNombreUsuario(primerNombre);
      }
    }
  }, []);

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(48,64,111,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', height: 66 }}>
        {/* Modificar por el logo de la ENEI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${NAVY}, ${NAVY_D})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px rgba(48,64,111,0.25)` }}>
            <span style={{ color: GOLD, fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.04em' }}>E</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1rem', color: NAVY, letterSpacing: '-0.02em', lineHeight: 1 }}>ENEI</div>
            <div style={{ fontFamily: 'Poppins', fontSize: '0.62rem', color: MUTED, letterSpacing: '0.04em', lineHeight: 1 }}>Escuela de Estadística</div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="hide-md" style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: SKY, fontSize: '0.9rem' }}>⌕</span>
          <input className="input-light" style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.8125rem' }}
            placeholder="Buscar cursos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/*Categorías*/}
        <div className="hide-md" style={{ position: 'relative' }}>
          <button onClick={() => setCatOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: NAVY, fontFamily: 'Poppins', fontSize: '0.8375rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '0.375rem 0.625rem', borderRadius: 6, transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
            Categorías <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
          </button>
          {catOpen && (
            <div style={{ position: 'absolute', top: '110%', left: 0, background: '#FFF', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '0.5rem', boxShadow: '0 8px 24px rgba(48,64,111,0.12)', minWidth: 180, zIndex: 200 }}>
              {navCats.map(c => (
                <button key={c} onClick={() => setCatOpen(false)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: TEXT, fontFamily: 'Poppins', fontSize: '0.8375rem', padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: 6, transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EBF4FB')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>{c}</button>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/*Botón de "Evaluación IA"*/}
          <div style={{ background: GOLD, borderRadius: 999, padding: '0.3rem 0.875rem', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(250,191,56,0.35)' }}>
            <span style={{ fontSize: '0.72rem' }}>✦</span>
            <span style={{ color: NAVY, fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>EVALUADOR IA</span>
          </div>

          {/*Botón de login*/}
          {authed ? (
            <>
              <button className="hide-sm" style={{ background: 'none', border: 'none', color: NAVY, fontFamily: 'Poppins', fontSize: '0.8375rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Mi Aprendizaje</button>
              
              {/* Avatar dropdown */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserOpen(o => !o)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${NAVY}, ${SKY})`, border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.8rem', color: '#FFF' }}>
                  {userName ? userName[0].toUpperCase() : 'U'}
                </button>
                {userOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#FFF', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '0.5rem', boxShadow: '0 8px 24px rgba(48,64,111,0.12)', minWidth: 200, zIndex: 200 }}>
                    <div style={{ padding: '0.625rem 0.75rem', borderBottom: `1px solid ${BORDER}`, marginBottom: '0.375rem' }}>
                      <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.875rem', color: NAVY }}> Hola, {nombreUsuario}</div>
                      <div style={{ color: MUTED, fontSize: '0.72rem' }}>Estudiante activo</div>
                    </div>
                    {['Mi Perfil', 'Mis Cursos', 'Certificados', 'Configuración'].map(item => (
                      <button
                        key={item}
                        onClick={() => {
                          if (item === 'Mi Perfil') {
                            setUserOpen(false);
                            onNavigatePerfil?.();
                          }
                        }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: TEXT, fontFamily: 'Poppins', fontSize: '0.8375rem', padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: 6, transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#EBF4FB')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}>{item}
                      </button>
                    ))}
                    <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: '0.375rem', paddingTop: '0.375rem' }}>
                      <button onClick={() => { setUserOpen(false); onLogout(); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#EF4444', fontFamily: 'Poppins', fontSize: '0.8375rem', padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: 6, transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}>Cerrar sesión</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn-navy hide-sm" style={{ fontSize: '0.8375rem', padding: '0.5rem 1.25rem' }} onClick={onLogin}>Iniciar Sesión</button>
              <button className="btn-gold" style={{ fontSize: '0.8375rem', padding: '0.5rem 1.25rem' }} onClick={onRegister}>Registrarse</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
// ────────────────────────────────────────────────────────────────────────────