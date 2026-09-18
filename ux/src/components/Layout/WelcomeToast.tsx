import { useEffect } from 'react';
import { NAVY, MUTED } from '../../constants/colors';

// ─── Bienvenida ────────────────────────────────────────────────────────────
export function WelcomeToast({ name, onDismiss }: { name: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 300, background: '#FFF', border: `1.5px solid rgba(34,197,94,0.4)`, borderRadius: 12, padding: '1rem 1.375rem', boxShadow: '0 8px 32px rgba(48,64,111,0.15)', display: 'flex', alignItems: 'center', gap: 12, animation: 'modalIn 0.25s ease', maxWidth: 340 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1.5px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🎉</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.875rem', color: NAVY }}>¡Bienvenido{name ? `, ${name}` : ''}!</div>
        <div style={{ color: MUTED, fontSize: '0.78rem' }}>Tu cuenta ENEI está lista. ¡A aprender!</div>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>×</button>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────