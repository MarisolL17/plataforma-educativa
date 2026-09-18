import { NAVY } from '../../constants/colors';

interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: 'Poppins', fontSize: '0.8125rem', fontWeight: 600, color: NAVY }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-light"
        style={{ width: '100%', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236EA7DA' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '2.25rem' }}
      >
        <option value="">Selecciona una opción</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}