import { useState, CSSProperties } from 'react';
import { NAVY_D } from '../../constants/colors';

// ─── Bloqueo de acceso sin login ───────────────────────────────────────────
interface LockedButtonProps {
  label: string;
  icon?: string;
  onClick: () => void;
  style?: CSSProperties;
}

export function LockedButton({ label, icon, onClick, style = {} }: LockedButtonProps) {
  const [tip, setTip] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn-gold"
        onClick={onClick}
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        style={{ ...style, display: 'flex', alignItems: 'center', gap: 8, opacity: 0.82 }}
      >
        {icon && <span>{icon}</span>}
        {label}
        <span style={{ fontSize: '0.875rem', opacity: 0.75 }}>🔒</span>
      </button>
      {tip && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: NAVY_D, color: '#FFF', fontFamily: 'Poppins', fontSize: '0.75rem', padding: '0.4rem 0.875rem', borderRadius: 7, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 50, pointerEvents: 'none' }}>
          Inicia sesión para acceder
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: NAVY_D }} />
        </div>
      )}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────