// ─── Fondo del botón bloqueado ─────────────────────────────────────────────
export function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(35,48,88,0.55)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    />
  );
}
// ────────────────────────────────────────────────────────────────────────────