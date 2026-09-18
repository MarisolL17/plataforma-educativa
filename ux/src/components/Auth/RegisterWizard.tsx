//-----------------------------------

import React, { useState, useEffect } from 'react';
import { registrarUsuario } from '../../services/api';
import { NAVY, BORDER } from '../../constants/colors';
import { Backdrop } from '../Common/Backdrop';
import { Field } from '../Common/Field';

interface RegisterWizardProps {
  onClose: () => void;
  onGoLogin: () => void;
  onSuccess: (userObj: any) => void;
}

export function RegisterWizard({ onClose, onSuccess }: RegisterWizardProps) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Datos de Registro Básico (1 Solo Paso)
  const [nombres, setNombres] = useState('');
  const [apellido_paterno, setApellidoPaterno] = useState('');
  const [apellido_materno, setApellidoMaterno] = useState('');
  const [dni_documento, setDni] = useState('');
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleRegistroBasico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass !== confirmPass) {
      setErr('Las contraseñas no coinciden');
      return;
    }
    setErr('');
    setLoading(true);

    const payload = {
      nombres,
      apellido_paterno,
      apellido_materno,
      dni_documento,
      correo,
      password: pass
    };

    try {
      const res = await registrarUsuario(payload);
      setLoading(false);

      const userObj = res.usuario_id;

      if (userObj) {
        localStorage.setItem('usuario', JSON.stringify(userObj));
        onSuccess(userObj);
      }
    } catch (error: any) {
      setLoading(false);
      setErr(error?.message || 'Error durante el registro');
    }
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <div className="enei-card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, padding: '2.25rem', pointerEvents: 'all', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer' }}>×</button>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.375rem', color: NAVY }}>Crear cuenta en ENEI</h2>
            <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Ingresa tus datos básicos para registrarte</p>
          </div>

          {err && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.5rem', color: '#DC2626', fontSize: '0.8rem', marginBottom: '1rem' }}>{err}</div>}

          <form onSubmit={handleRegistroBasico} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Nombres *" placeholder="Ana María" value={nombres} onChange={setNombres} />
              <Field label="Apellido Paterno *" placeholder="García" value={apellido_paterno} onChange={setApellidoPaterno} />
              <Field label="Apellido Materno *" placeholder="López" value={apellido_materno} onChange={setApellidoMaterno} />
            </div>
            <Field label="DNI / Documento de Identidad *" placeholder="12345678" value={dni_documento} onChange={setDni} />
            <Field label="Correo electrónico *" type="email" placeholder="ana@correo.com" value={correo} onChange={setCorreo} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Contraseña *" type="password" placeholder="Mínimo 8 caracteres" value={pass} onChange={setPass} />
              <Field label="Confirmar contraseña *" type="password" placeholder="Repite la contraseña" value={confirmPass} onChange={setConfirmPass} />
            </div>

            <button type="submit" className="btn-gold" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}