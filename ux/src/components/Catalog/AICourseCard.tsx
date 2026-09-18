import { useState } from 'react';
import { NAVY, GOLD, MUTED } from '../../constants/colors';

// ─── Para los "Cursos con IA ? " ──────────────────────────────────────────
export interface AICourse {
  id: number;
  title: string;
  dur: string;
  level: string;
  img: string;
  tag: string;
}

export function AICourseCard({ c }: { c: AICourse }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="enei-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ minWidth: 230, maxWidth: 230, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, padding: 0, border: `1px solid rgba(110,167,218,0.4)` }}>
      <div style={{ height: 122, position: 'relative', background: '#EBF4FB', overflow: 'hidden' }}>
        <img src={`https://images.unsplash.com/photo-${c.img.replace('photo-', '')}?w=460&h=244&fit=crop&auto=format`}
          alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(48,64,111,0.55))' }} />
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
          <span style={{ background: GOLD, color: NAVY, fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, fontFamily: 'Montserrat' }}>✦ IA</span>
          {c.tag && <span style={{ background: NAVY, color: '#FFF', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, fontFamily: 'Montserrat' }}>{c.tag}</span>}
        </div>
      </div>
      <div style={{ padding: '0.875rem' }}>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.84rem', color: NAVY, marginBottom: '0.375rem', lineHeight: 1.3 }}>{c.title}</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: MUTED, fontSize: '0.7rem' }}>⏱ {c.dur}</span>
          <span style={{ color: MUTED, fontSize: '0.7rem' }}>· {c.level}</span>
        </div>
      </div>
    </div>
  );
}