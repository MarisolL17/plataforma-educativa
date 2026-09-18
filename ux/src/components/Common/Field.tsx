
// ─── Campo de entrada del login ─────────────────────────────────────────────
import { NAVY } from '../../constants/colors';

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function Field({ label, type = 'text', placeholder, value, onChange, disabled }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: 'Poppins', fontSize: '0.8125rem', fontWeight: 600, color: NAVY }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="input-light"
        //style={{ width: '100%' }}
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          borderRadius: 8,
          border: '1px solid #CBD5E1',
          fontFamily: 'Poppins',
          fontSize: '0.85rem',
          backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF', // Fondo gris si está deshabilitado
          cursor: disabled ? 'not-allowed' : 'text'
        }}
      />
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────