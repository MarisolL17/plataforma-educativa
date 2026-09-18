import { useState } from 'react';
import { NAVY, MUTED } from '../../constants/colors';

// ─── Para los "Cursos populares" ──────────────────────────────────────────
export interface PopularCourse {
  id: number;
  title: string;
  cat: string;
  dur: string;
  level: string;
  students: string;
  prereq: string;
  img: string;
  catColor: string;
}

export function CourseCard({ c }: { c: PopularCourse }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="enei-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ minWidth: 244, maxWidth: 244, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
      <div style={{ height: 138, position: 'relative', background: '#EBF4FB', overflow: 'hidden' }}>
        <img src={`https://images.unsplash.com/photo-${c.img.replace('photo-', '')}?w=488&h=276&fit=crop&auto=format`}
          alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(48,64,111,0.6))' }} />
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span style={{ background: c.catColor, color: '#FFF', fontSize: '0.62rem', fontWeight: 700, padding: '2px 9px', borderRadius: 999, fontFamily: 'Montserrat' }}>{c.cat}</span>
        </div>
        {hov && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '1.125rem', marginLeft: 3 }}>▶</span>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '0.875rem' }}>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.875rem', color: NAVY, marginBottom: '0.375rem', lineHeight: 1.3 }}>{c.title}</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
          <span style={{ color: MUTED, fontSize: '0.7rem' }}>⏱ {c.dur}</span>
          <span style={{ color: MUTED, fontSize: '0.7rem' }}>· {c.level}</span>
          <span style={{ color: MUTED, fontSize: '0.7rem' }}>· {c.students} alumnos</span>
        </div>
        <div style={{ background: '#EBF4FB', border: `1px solid rgba(110,167,218,0.35)`, borderRadius: 6, padding: '0.3rem 0.625rem', fontSize: '0.68rem', color: NAVY, fontWeight: 500 }}>
          📋 Pre-req: {c.prereq}
        </div>
      </div>
    </div>
  );
}