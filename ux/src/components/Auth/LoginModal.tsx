
// ────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { loginUsuario } from '../../services/api';
import { NAVY, GOLD, SKY, MUTED, BORDER } from '../../constants/colors';
import { Backdrop } from '../Common/Backdrop';
import { Field } from '../Common/Field';

// ─── Modal para el inicio de sesión ────────────────────────────────────────
interface LoginModalProps {
  onClose: () => void;
  onGoRegister: () => void;
  // 1. Actualizamos onSuccess para que acepte el objeto del usuario devuelto por FastAPI
  onSuccess: (usuario: any) => void;
}

export function LoginModal({ onClose, onGoRegister, onSuccess }: LoginModalProps) {
  const [correo, setCorreo] = useState(''); // Nuevo estado para el correo electrónico
  const [pass, setPass] = useState('');
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (!correo.trim() || !pass.trim()) {
      setErr('Por favor completa todos los campos');
      return;
    }
    setErr('');
    setLoading(true);

    try {
      const res = await loginUsuario(correo, pass);

      // 2. FastAPI devuelve los datos dentro de res.usuario (de tu endpoint /login)
      const userObj = res.usuario || res.user;

      if (res.access_token || res.token) {
        localStorage.setItem('token', res.access_token || res.token);
      }

      if (userObj) {
        localStorage.setItem('usuario', JSON.stringify(userObj));
      }

      setLoading(false);
      // 3. Enviamos el objeto del usuario a onSuccess para actualizar App.tsx
      onSuccess(userObj);
      onClose();
    } catch (error: any) {
      setLoading(false);
      setErr('Error de ingreso: ' + (error?.message || 'Credenciales inválidas'));
    }
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <div
          className="enei-card"
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 440, padding: '2.25rem', pointerEvents: 'all', position: 'relative', animation: 'modalIn 0.22s ease' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: '1rem', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}>
            ×
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.875rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(48,64,111,0.25)' }}>
              <span style={{ color: GOLD, fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.25rem' }}>E</span>
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.375rem', color: NAVY, marginBottom: 4 }}>Iniciar Sesión en ENEI</h2>
            <p style={{ color: MUTED, fontSize: '0.85rem' }}>Accede a tu cuenta y continúa aprendiendo</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', marginBottom: '1.5rem' }}>
            <Field label="ID de Usuario / Correo electrónico" placeholder="usuario@enei.edu.pe" value={correo} onChange={setCorreo} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Field label="Contraseña" type="password" placeholder="••••••••" value={pass} onChange={setPass} />
              <div style={{ textAlign: 'right' }}>
                <a href="#" style={{ color: SKY, fontSize: '0.775rem', fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = NAVY}
                  onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = SKY}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </form>

          {err && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.625rem 0.875rem', color: '#DC2626', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {err}
            </div>
          )}

          <button className="btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9375rem', padding: '0.875rem', opacity: loading ? 0.75 : 1 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar a ENEI'}
          </button>

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ color: MUTED, fontSize: '0.75rem' }}>o continúa con</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {['Google', 'Microsoft'].map(p => (
              <button key={p} style={{ flex: 1, background: '#F8FAFC', border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: '0.625rem', fontFamily: 'Poppins', fontSize: '0.8125rem', fontWeight: 500, color: NAVY, cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = SKY; e.currentTarget.style.background = '#EBF4FB'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = '#F8FAFC'; }}>
                {p}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.375rem', color: MUTED, fontSize: '0.8125rem' }}>
            ¿No tienes cuenta?{' '}
            <button onClick={onGoRegister} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, fontFamily: 'Poppins', fontSize: '0.8125rem', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Crea una aquí
            </button>
          </p>
        </div>
      </div>
    </>
  );
}