import { CarouselRow } from './CarouselRow';
import { CourseCard, PopularCourse } from './CourseCard';
import { AICourseCard, AICourse } from './AICourseCard';
import { NAVY, SKY } from '../../constants/colors';

const popularCourses: PopularCourse[] = [
  { id: 1, title: 'Estadística Descriptiva', cat: 'Fundamentos', dur: '28h', level: 'Básico',     students: '14.2k', prereq: 'Ninguno',         img: 'photo-1509228468518-180dd4864904', catColor: SKY },
  { id: 2, title: 'Inferencia Estadística',  cat: 'Inferencia',  dur: '36h', level: 'Intermedio', students: '9.8k',  prereq: 'Est. Descriptiva', img: 'photo-1635070041078-e363dbe005cb',  catColor: NAVY },
  { id: 3, title: 'Regresión Lineal y GLM',  cat: 'Modelado',    dur: '42h', level: 'Intermedio', students: '7.3k',  prereq: 'Inferencia',       img: 'photo-1551288049-bebda4e38f71',  catColor: '#0EA5E9' },
  { id: 4, title: 'Series de Tiempo',        cat: 'Avanzado',    dur: '38h', level: 'Avanzado',   students: '4.1k',  prereq: 'Regresión Lineal', img: 'photo-1611974789855-9c2a0a7236a3', catColor: '#8B5CF6' },
  { id: 5, title: 'Estadística Bayesiana',   cat: 'Bayesiana',   dur: '44h', level: 'Avanzado',   students: '3.6k',  prereq: 'Probabilidad',     img: 'photo-1518186285589-2f7649de83e0', catColor: '#EC4899' },
  { id: 6, title: 'Muestreo y Diseño Exp.',  cat: 'Muestreo',    dur: '30h', level: 'Intermedio', students: '5.9k',  prereq: 'Est. Descriptiva', img: 'photo-1560472354-b33ff0c44a43',  catColor: '#10B981' },
];

const aiCourses: AICourse[] = [
  { id: 1, title: 'Análisis Predictivo con IA', dur: '22h', level: 'Intermedio', img: 'photo-1677442135703-1787eea5ce01', tag: 'Nuevo' },
  { id: 2, title: 'ML Estadístico con Python',  dur: '34h', level: 'Avanzado',   img: 'photo-1620712943543-bcc4688e7485', tag: 'Popular' },
  { id: 3, title: 'Visualización Estadística',  dur: '18h', level: 'Básico',     img: 'photo-1504868584819-f8e8b4b6d7e3', tag: 'Nuevo' },
  { id: 4, title: 'NLP & Text Mining',          dur: '26h', level: 'Avanzado',   img: 'photo-1546953304-5d96f43c2e94', tag: '' },
  { id: 5, title: 'Redes Neuronales para Stats',dur: '30h', level: 'Avanzado',   img: 'photo-1485827404703-89b55fcc595e', tag: 'Nuevo' },
];

export function CourseCatalog() {
  return (
    <section className="section-alt" style={{ padding: '4.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '2.75rem' }}>
          <h2 className="h-section" style={{ fontSize: 'clamp(1.625rem, 2.8vw, 2.25rem)', marginBottom: 8 }}>Catálogo de Cursos ENEI</h2>
          <p className="muted-text" style={{ fontSize: '0.9375rem' }}>Cursos diseñados por estadísticos, con evaluación IA integrada para guiar tu progreso</p>
        </div>
        <CarouselRow title="Cursos Populares" badge="🔥 Más vistos">
          {popularCourses.map(c => <CourseCard key={c.id} c={c} />)}
        </CarouselRow>
        <CarouselRow title="Cursos con Evaluación IA" badge="✦ Nuevo">
          {aiCourses.map(c => <AICourseCard key={c.id} c={c} />)}
        </CarouselRow>
      </div>
    </section>
  );
}