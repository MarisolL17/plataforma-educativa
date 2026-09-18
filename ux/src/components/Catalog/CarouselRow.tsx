import React, { useRef } from 'react';
import { NAVY, BORDER, SHADOW } from '../../constants/colors';

// ─── Para que se coloque en modo carrusel ─────────────────────────────────
export function CarouselRow({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 540, behavior: 'smooth' });
  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="h-section" style={{ fontSize: '1.1875rem' }}>{title}</span>
          {badge && <span className="badge-gold">{badge}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[-1, 1].map(d => (
            <button key={d} onClick={() => scroll(d)}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFF', border: `1.5px solid ${BORDER}`, color: NAVY, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: 'all 0.15s', boxShadow: SHADOW }}
              onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#FFF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = NAVY; }}>
              {d === -1 ? '‹' : '›'}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="carousel-track" style={{ display: 'flex', gap: '1rem', paddingBottom: 8 }}>
        {children}
      </div>
    </div>
  );
}