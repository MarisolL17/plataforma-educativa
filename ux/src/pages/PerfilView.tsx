import React, { useState, useEffect } from 'react';
import { NAVY, SKY, GOLD, MUTED, BORDER } from '../constants/colors';
import { Field } from '../components/Common/Field';
import { SelectField } from '../components/Common/SelectField';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ==========================================
// INTERFACES (Estructura de Datos por Cuadro)
// ==========================================

export interface NivelAcademicoItem {
  id: string;
  nivel: string;
  carrera: string;
  centroEstudios: string;
  grado: string;
  ciclo: string;
  fechaEmision: string;
  nroRegistro: string;
  pais: string;
  archivoAdjunto?: string;
}

export interface PostgradoItem {
  id: string;
  nivel: string;
  grado: string;
  postgrado: string;
  centroEstudios: string;
  fechaEmision: string;
  pais: string;
  archivoAdjunto?: string;
}

export interface EducacionComplementariaItem {
  id: string;
  centroEstudios: string;
  estudioRealizado: string;
  duracion: string;
  fechaEmision: string;
  pais: string;
  archivoAdjunto?: string;
}

export interface IdiomaItem {
  id: string;
  idioma: string;
  nivelDominio: string;
}

export interface ExperienciaIneiItem {
  id: string;
  dependencia: string;
  cargoContractual: string;
  cargoFuncional: string;
  numeroContrato: string;
  tipoPlanilla: string;
  fechaInicio: string;
  fechaFin: string;
  cargoTdr: string;
  archivoTdr?: string;
}

export interface OtraExperienciaItem {
  id: string;
  institucion: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string;
  tiempo: string;
  archivoAdjunto?: string;
}

export interface MeritoItem {
  id: string;
  tipoDocumento: string;
  institucion: string;
  tituloMerito: string;
  fechaMerito: string;
}

export interface PublicacionItem {
  id: string;
  titulo: string;
  tipo: string;
  fecha: string;
}

export interface DocumentoAdicionalItem {
  id: string;
  documento: string;
  archivoAdjunto?: string;
}

interface PerfilViewProps {
  usuarioId?: number | string;
  initialData?: any;
  onVolver: () => void;
}

export function PerfilView({ usuarioId = 1, initialData, onVolver }: PerfilViewProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState({ text: '', isError: false });
  const [activeTab, setActiveTab] = useState<'personal' | 'academico' | 'laboral'>('personal');

  // ==========================================
  // ESTADOS: INFORMACIÓN PERSONAL
  // ==========================================
  const [apellidoPaterno, setApellidoPaterno] = useState(initialData?.apellidoPaterno || '');
  const [apellidoMaterno, setApellidoMaterno] = useState(initialData?.apellidoMaterno || '');
  const [nombres, setNombres]                 = useState(initialData?.nombres || '');
  const [tipoDoc, setTipoDoc]                 = useState(initialData?.tipoDoc || 'DNI');
  const [nroDoc, setNroDoc]                   = useState(initialData?.dni_documento || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(initialData?.fechaNacimiento || '');
  const [estadoCivil, setEstadoCivil]         = useState(initialData?.estadoCivil || '');
  const [sexo, setSexo]                       = useState(initialData?.sexo || '');
  const [ruc, setRuc]                         = useState(initialData?.ruc || '');
  const [correo, setCorreo]                   = useState(initialData?.correo || '');
  const [movil, setMovil]                     = useState(initialData?.movil || '');
  const [telefonoFijo, setTelefonoFijo]       = useState(initialData?.telefonoFijo || '');
  const [paisNacimiento, setPaisNacimiento]   = useState(initialData?.paisNacimiento || 'Perú');
  const [lugarNacimiento, setLugarNacimiento] = useState(initialData?.lugarNacimiento || '');
  const [direccion, setDireccion]             = useState(initialData?.direccion || '');
  const [lugarResidencia, setLugarResidencia] = useState(initialData?.lugarResidencia || '');

  // ==========================================
  // ESTADOS: CUADROS DEL PERFIL ACADÉMICO
  // ==========================================
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademicoItem[]>(initialData?.nivelesAcademicos || []);
  const [postgrados, setPostgrados]               = useState<PostgradoItem[]>(initialData?.postgrados || []);
  const [educacionComp, setEducacionComp]         = useState<EducacionComplementariaItem[]>(initialData?.educacionComp || []);
  const [idiomas, setIdiomas]                     = useState<IdiomaItem[]>(initialData?.idiomas || []);

  // ==========================================
  // ESTADOS: CUADROS DEL PERFIL LABORAL
  // ==========================================
  const [expInei, setExpInei]               = useState<ExperienciaIneiItem[]>(initialData?.expInei || []);
  const [otrasExp, setOtrasExp]             = useState<OtraExperienciaItem[]>(initialData?.otrasExp || []);
  const [meritos, setMeritos]               = useState<MeritoItem[]>(initialData?.meritos || []);
  const [publicaciones, setPublicaciones]   = useState<PublicacionItem[]>(initialData?.publicaciones || []);
  const [docsAdicionales, setDocsAdicionales] = useState<DocumentoAdicionalItem[]>(initialData?.docsAdicionales || []);
  const [habilidades, setHabilidades]       = useState(initialData?.skills || '');

  // ==========================================
  // CARGA DE DATOS DESDE EL BACKEND
  // ==========================================

// Reemplaza la sección de useEffect en tu src/pages/PerfilView.tsx con esta versión:

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);

      // 1. Cargar el usuario local por defecto (Fallback)
      const storedUser = localStorage.getItem('usuario');
      const localData = initialData || (storedUser ? JSON.parse(storedUser) : null);

      if (localData) {
        setApellidoPaterno(localData.apellidoPaterno || localData.apellido_paterno || '');
        setApellidoMaterno(localData.apellidoMaterno || localData.apellido_materno || '');
        setNombres(localData.nombres || localData.nombre || '');
        setTipoDoc(localData.tipoDoc || localData.tipo_doc || 'DNI');
        setNroDoc(localData.nroDoc || localData.dni_documento || localData.dni || '');
        setCorreo(localData.correo || localData.email || '');
        setMovil(localData.movil || localData.telefono || '');
      }

      const targetId = usuarioId || localData?.id;
      if (!targetId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/v1/auth/perfil/${targetId}`);
        if (response.ok) {
          const data = await response.json();
          const p = data.personal || {};

          if (p && Object.keys(p).length > 0) {
            setApellidoPaterno(p.apellidoPaterno || p.apellido_paterno || localData?.apellidoPaterno || localData?.apellido_paterno || '');
            setApellidoMaterno(p.apellidoMaterno || p.apellido_materno || localData?.apellidoMaterno || localData?.apellido_materno || '');
            setNombres(p.nombres || p.nombre || localData?.nombres || localData?.nombre || '');
            setTipoDoc(p.tipoDoc || p.tipo_doc || '');
            setNroDoc(p.nroDoc || p.dni_documento || p.dni || localData?.dni_documento || '');
            setFechaNacimiento(p.fechaNacimiento || p.fecha_nacimiento || '');
            setEstadoCivil(p.estadoCivil || p.estado_civil || '');
            setSexo(p.sexo || '');
            setRuc(p.ruc || '');
            setCorreo(p.correo || p.email || localData?.correo || localData?.email || '');
            setMovil(p.movil || p.telefono || localData?.movil || '');
            setTelefonoFijo(p.telefonoFijo || p.telefono_fijo || '');
            setPaisNacimiento(p.paisNacimiento || p.pais_nacimiento || '');
            setLugarNacimiento(p.lugarNacimiento || p.lugar_nacimiento || '');
            setDireccion(p.direccion || '');
            setLugarResidencia(p.lugarResidencia || p.lugar_residencia || '');
          }

          if (data.academico) {
            setNivelesAcademicos(data.academico.nivelesAcademicos || []);
            setPostgrados(data.academico.postgrados || []);
            setEducacionComp(data.academico.educacionComp || []);
            setIdiomas(data.academico.idiomas || []);
          }

          if (data.laboral) {
            setExpInei(data.laboral.expInei || []);
            setOtrasExp(data.laboral.otrasExp || []);
            setMeritos(data.laboral.meritos || []);
            setPublicaciones(data.laboral.publicaciones || []);
            setDocsAdicionales(data.laboral.docsAdicionales || []);
            setHabilidades(data.laboral.habilidades || '');
          }
        }
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [usuarioId, initialData]);

  // ==========================================
  // GESTIÓN DE MODALES DINÁMICOS
  // ==========================================
  const [modalType, setModalType] = useState<string | null>(null);
  const [formData, setFormData]   = useState<any>({});

  const openModal = (type: string) => {
    setFormData({});
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({});
  };

  const handleSaveModalItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { ...formData, id: Date.now().toString() };

    switch (modalType) {
      case 'nivelAcademico':
        setNivelesAcademicos([...nivelesAcademicos, newItem]);
        break;
      case 'postgrado':
        setPostgrados([...postgrados, newItem]);
        break;
      case 'educacionComp':
        setEducacionComp([...educacionComp, newItem]);
        break;
      case 'idioma':
        setIdiomas([...idiomas, newItem]);
        break;
      case 'expInei':
        setExpInei([...expInei, newItem]);
        break;
      case 'otraExp':
        setOtrasExp([...otrasExp, newItem]);
        break;
      case 'merito':
        setMeritos([...meritos, newItem]);
        break;
      case 'publicacion':
        setPublicaciones([...publicaciones, newItem]);
        break;
      case 'docAdicional':
        setDocsAdicionales([...docsAdicionales, newItem]);
        break;
      default:
        break;
    }
    closeModal();
  };

  // Reemplaza handleGuardarPerfil en src/pages/PerfilView.tsx

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', isError: false });

    // 1. Intentar obtener el ID desde las props o desde el localStorage
    const storedUserStr = localStorage.getItem('usuario');
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

    const targetId = Number(usuarioId || storedUser?.id)

    if (!targetId || isNaN(targetId) || targetId <= 0) {
      setMsg({ text: 'ID de usuario inválido', isError: true });
      setSaving(false);
      return;
    }

    const payload = {
      usuario_id: targetId,
      personal: {
        apellidoPaterno: apellidoPaterno || '',
        apellidoMaterno: apellidoMaterno || '',
        nombres: nombres || '',
        tipoDoc,
        nroDoc,
        fechaNacimiento: fechaNacimiento || null,
        estadoCivil,
        sexo,
        ruc,
        correo,
        movil,
        telefonoFijo,
        paisNacimiento,
        lugarNacimiento,
        direccion,
        lugarResidencia
      },
      academico: { nivelesAcademicos, postgrados, educacionComp, idiomas },
      laboral: { expInei, otrasExp, meritos, publicaciones, docsAdicionales, habilidades }
    };

    try {
      const response = await fetch(`${API_URL}/v1/auth/completar_perfil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || `Error ${response.status}: No se encontró la ruta o el usuario`);
      }

      setMsg({ text: '¡Perfil actualizado exitosamente!', isError: false });
    } catch (err: any) {
      setMsg({ text: err?.message || 'Error al guardar los datos', isError: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Montserrat', fontWeight: 600, color: NAVY }}>Cargando perfil del usuario...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* ENCABEZADO */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <button onClick={onVolver} style={{ background: 'none', border: 'none', color: SKY, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              ← Volver a la Plataforma
            </button>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.75rem', color: NAVY }}>
              Ficha del Postulante / Perfil Profesional
            </h1>
            <p style={{ color: MUTED, fontSize: '0.875rem' }}>
              Completa y actualiza tu legajo de información personal, académica y experiencia laboral.
            </p>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: NAVY, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.5rem', border: `3px solid ${GOLD}` }}>
            {nombres ? nombres[0].toUpperCase() : 'U'}
          </div>
        </div>

        {/* NAVEGACIÓN DE SECCIONES (TABS) */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: `2px solid ${BORDER}` }}>
          {[
            { id: 'personal', label: '👤 Información Personal' },
            { id: 'academico', label: '🎓 Perfil Académico' },
            { id: 'laboral', label: '💼 Perfil Laboral & Méritos' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                fontFamily: 'Montserrat',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.9rem',
                color: activeTab === tab.id ? NAVY : MUTED,
                borderBottom: activeTab === tab.id ? `3px solid ${GOLD}` : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {msg.text && (
          <div style={{ padding: '0.875rem', borderRadius: 8, marginBottom: '1.5rem', background: msg.isError ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${msg.isError ? '#FECACA' : '#BBF7D0'}`, color: msg.isError ? '#DC2626' : '#166534', fontSize: '0.875rem' }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleGuardarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* ========================================== */}
          {/* SECCIÓN 1: INFORMACIÓN PERSONAL            */}
          {/* ========================================== */}
          {activeTab === 'personal' && (
            <div className="enei-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: NAVY, marginBottom: '1.25rem', borderBottom: `1px solid ${BORDER}`, paddingBottom: '0.5rem' }}>
                Datos de Identificación y Contacto
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <Field label="Apellido Paterno *" value={apellidoPaterno} onChange={setApellidoPaterno} />
                <Field label="Apellido Materno *" value={apellidoMaterno} onChange={setApellidoMaterno} />
                <Field label="Nombres *" value={nombres} onChange={setNombres} />
                
                <SelectField label="Tipo de Documento *" value={tipoDoc} onChange={setTipoDoc} options={['DNI', 'Carnet de Extranjería', 'Pasaporte']} />
                <Field label="Nro de Documento *" value={nroDoc} onChange={setNroDoc} />
                <Field label="Número de RUC" value={ruc} onChange={setRuc} placeholder="10xxxxxxxx" />

                <Field label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={setFechaNacimiento} />
                <SelectField label="Estado Civil" value={estadoCivil} onChange={setEstadoCivil} options={['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Conviviente']} />
                <SelectField label="Sexo" value={sexo} onChange={setSexo} options={['Masculino', 'Femenino']} />

                <Field label="Correo Electrónico *" type="email" value={correo} onChange={setCorreo} />
                <Field label="Móvil Personal *" value={movil} onChange={setMovil} />
                <Field label="Teléfono Fijo" value={telefonoFijo} onChange={setTelefonoFijo} />

                <Field label="País de Nacimiento" value={paisNacimiento} onChange={setPaisNacimiento} />
                <Field label="Lugar de Nacimiento (Dpto/Prov/Dist)" value={lugarNacimiento} onChange={setLugarNacimiento} />
                <Field label="Dirección de Domicilio" value={direccion} onChange={setDireccion} />
                <Field label="Lugar de Residencia Actual" value={lugarResidencia} onChange={setLugarResidencia} />
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SECCIÓN 2: PERFIL ACADÉMICO               */}
          {/* ========================================== */}
          {activeTab === 'academico' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <TableCard
                title="Cuadro 1: Nivel Académico"
                subtitle="Título Profesional, Bachiller, Egresado o Secundaria"
                onAdd={() => openModal('nivelAcademico')}
                headers={['Nivel', 'Carrera', 'Centro de Estudios', 'Grado', 'Emisión', 'Acciones']}
                items={nivelesAcademicos}
                renderRow={(item: NivelAcademicoItem) => (
                  <>
                    <td>{item.nivel}</td>
                    <td>{item.carrera}</td>
                    <td>{item.centroEstudios}</td>
                    <td>{item.grado}</td>
                    <td>{item.fechaEmision}</td>
                  </>
                )}
                onDelete={(id) => setNivelesAcademicos(nivelesAcademicos.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 2: Postgrado o Especialización"
                subtitle="Doctorados, Maestrías, Diplomados y Cursos de Especialización"
                onAdd={() => openModal('postgrado')}
                headers={['Nivel', 'Grado / Título', 'Postgrado', 'Centro de Estudios', 'Emisión', 'Acciones']}
                items={postgrados}
                renderRow={(item: PostgradoItem) => (
                  <>
                    <td>{item.nivel}</td>
                    <td>{item.grado}</td>
                    <td>{item.postgrado}</td>
                    <td>{item.centroEstudios}</td>
                    <td>{item.fechaEmision}</td>
                  </>
                )}
                onDelete={(id) => setPostgrados(postgrados.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 3: Educación Complementaria"
                subtitle="Cursos, Seminarios Taller, Certificaciones, otros"
                onAdd={() => openModal('educacionComp')}
                headers={['Estudio Realizado', 'Centro de Estudios', 'Duración', 'Emisión', 'Acciones']}
                items={educacionComp}
                renderRow={(item: EducacionComplementariaItem) => (
                  <>
                    <td>{item.estudioRealizado}</td>
                    <td>{item.centroEstudios}</td>
                    <td>{item.duracion}</td>
                    <td>{item.fechaEmision}</td>
                  </>
                )}
                onDelete={(id) => setEducacionComp(educacionComp.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 4: Idioma(s) o Lenguas"
                subtitle="Idiomas que habla y su nivel de dominio"
                onAdd={() => openModal('idioma')}
                headers={['Idioma / Lengua', 'Nivel de Dominio', 'Acciones']}
                items={idiomas}
                renderRow={(item: IdiomaItem) => (
                  <>
                    <td>{item.idioma}</td>
                    <td>{item.nivelDominio}</td>
                  </>
                )}
                onDelete={(id) => setIdiomas(idiomas.filter(i => i.id !== id))}
              />
            </div>
          )}

          {/* ========================================== */}
          {/* SECCIÓN 3: PERFIL LABORAL & MÉRITOS       */}
          {/* ========================================== */}
          {activeTab === 'laboral' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <TableCard
                title="Cuadro 1: Experiencia Laboral INEI"
                subtitle="Información extraída o acreditada de contrataciones en INEI"
                onAdd={() => openModal('expInei')}
                headers={['Dependencia', 'Cargo Contractual', 'N° Contrato', 'Periodo', 'Acciones']}
                items={expInei}
                renderRow={(item: ExperienciaIneiItem) => (
                  <>
                    <td>{item.dependencia}</td>
                    <td>{item.cargoContractual}</td>
                    <td>{item.numeroContrato}</td>
                    <td>{item.fechaInicio} al {item.fechaFin}</td>
                  </>
                )}
                onDelete={(id) => setExpInei(expInei.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 2: Otras Experiencias Laborales"
                subtitle="Constancias y Certificados de trabajo en sector público/privado"
                onAdd={() => openModal('otraExp')}
                headers={['Institución / Empresa', 'Cargo', 'Periodo', 'Tiempo Total', 'Acciones']}
                items={otrasExp}
                renderRow={(item: OtraExperienciaItem) => (
                  <>
                    <td>{item.institucion}</td>
                    <td>{item.cargo}</td>
                    <td>{item.fechaInicio} al {item.fechaFin}</td>
                    <td>{item.tiempo}</td>
                  </>
                )}
                onDelete={(id) => setOtrasExp(otrasExp.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 3: Méritos y Reconocimientos"
                subtitle="Reconocimientos oficiales y felicitaciones"
                onAdd={() => openModal('merito')}
                headers={['Tipo Doc.', 'Institución', 'Título del Reconocimiento', 'Fecha', 'Acciones']}
                items={meritos}
                renderRow={(item: MeritoItem) => (
                  <>
                    <td>{item.tipoDocumento}</td>
                    <td>{item.institucion}</td>
                    <td>{item.tituloMerito}</td>
                    <td>{item.fechaMerito}</td>
                  </>
                )}
                onDelete={(id) => setMeritos(meritos.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 4: Publicaciones"
                subtitle="Libros, artículos de investigación o ensayos"
                onAdd={() => openModal('publicacion')}
                headers={['Título de la Publicación', 'Tipo', 'Fecha Emisión', 'Acciones']}
                items={publicaciones}
                renderRow={(item: PublicacionItem) => (
                  <>
                    <td>{item.titulo}</td>
                    <td>{item.tipo}</td>
                    <td>{item.fecha}</td>
                  </>
                )}
                onDelete={(id) => setPublicaciones(publicaciones.filter(i => i.id !== id))}
              />

              <TableCard
                title="Cuadro 5: Documentos Adicionales"
                subtitle="Fuerzas Armadas, CONADIS, Colegiatura, Brevete, etc."
                onAdd={() => openModal('docAdicional')}
                headers={['Documento Adicional / Tipo', 'Estado Adjunto', 'Acciones']}
                items={docsAdicionales}
                renderRow={(item: DocumentoAdicionalItem) => (
                  <>
                    <td>{item.documento}</td>
                    <td>{item.archivoAdjunto ? '📎 Archivo Subido' : 'Sin archivo'}</td>
                  </>
                )}
                onDelete={(id) => setDocsAdicionales(docsAdicionales.filter(i => i.id !== id))}
              />

              <div className="enei-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontFamily: 'Montserrat', color: NAVY, fontWeight: 700, marginBottom: '0.5rem' }}>
                  Habilidades y/o Conocimientos Especializados
                </h4>
                <p style={{ color: MUTED, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Ingresa tus principales competencias técnicas separadas por comas (ej. SPSS, Python, Stata, Gestión Pública):</p>
                <input
                  className="input-light"
                  style={{ width: '100%', padding: '0.625rem 0.875rem' }}
                  value={habilidades}
                  onChange={(e) => setHabilidades(e.target.value)}
                  placeholder="SPSS, Python, R, Stata, Excel Avanzado..."
                />
              </div>
            </div>
          )}

          {/* BOTÓN GENERAL DE GUARDAR */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onVolver} style={{ padding: '0.75rem 1.5rem', borderRadius: 8, border: `1px solid ${BORDER}`, background: '#FFF', color: NAVY, fontWeight: 600, cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-gold" style={{ padding: '0.75rem 2rem', opacity: saving ? 0.75 : 1 }} disabled={saving}>
              {saving ? 'Guardando Cambios...' : '💾 Guardar Todo el Perfil'}
            </button>
          </div>

        </form>
      </div>

      {/* MODAL DINÁMICO */}
      {modalType && (
        <DynamicModal
          type={modalType}
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSave={handleSaveModalItem}
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES PARA TABLAS Y MODALES
// ==========================================

interface TableCardProps {
  title: string;
  subtitle: string;
  onAdd: () => void;
  headers: string[];
  items: any[];
  renderRow: (item: any) => React.ReactNode;
  onDelete: (id: string) => void;
}

function TableCard({ title, subtitle, onAdd, headers, items, renderRow, onDelete }: TableCardProps) {
  return (
    <div className="enei-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ fontFamily: 'Montserrat', color: NAVY, fontSize: '1rem', fontWeight: 700 }}>{title}</h4>
          <span style={{ color: MUTED, fontSize: '0.78rem' }}>{subtitle}</span>
        </div>
        <button type="button" onClick={onAdd} className="btn-sky" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: 6 }}>
          + Agregar
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.25rem', border: `1px dashed ${BORDER}`, borderRadius: 8, color: MUTED, fontSize: '0.825rem' }}>
          No hay registros en este cuadro. Haz clic en <strong>"+ Agregar"</strong>.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: NAVY, color: '#FFF' }}>
                <th style={{ padding: '0.5rem' }}>Nro.</th>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '0.5rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${BORDER}`, background: idx % 2 === 0 ? '#FFF' : '#F8FAFC' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600, color: NAVY }}>{idx + 1}</td>
                  {renderRow(item)}
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <button type="button" onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 600 }}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DynamicModal({ type, formData, setFormData, onClose, onSave }: any) {
  const updateField = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#FFF', borderRadius: 12, padding: '1.75rem', maxWidth: 500, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
        <h4 style={{ fontFamily: 'Montserrat', fontWeight: 700, color: NAVY, marginBottom: '1rem' }}>
          Registrar nuevo item
        </h4>

        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {type === 'nivelAcademico' && (
            <>
              <SelectField label="Nivel *" value={formData.nivel || ''} onChange={v => updateField('nivel', v)} options={['Título Profesional', 'Bachiller', 'Certificado Egresado Inst/Univ', 'Constancia Estudios', 'Secundaria Completa']} />
              <Field label="Carrera *" value={formData.carrera || ''} onChange={v => updateField('carrera', v)} placeholder="Ej. Estadística" />
              <Field label="Centro de Estudios *" value={formData.centroEstudios || ''} onChange={v => updateField('centroEstudios', v)} />
              <Field label="Grado *" value={formData.grado || ''} onChange={v => updateField('grado', v)} placeholder="Ej. Licenciado / Bachiller" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Field label="Ciclo" value={formData.ciclo || ''} onChange={v => updateField('ciclo', v)} />
                <Field label="Fecha Emisión" type="date" value={formData.fechaEmision || ''} onChange={v => updateField('fechaEmision', v)} />
              </div>
              <Field label="N° de Registro" value={formData.nroRegistro || ''} onChange={v => updateField('nroRegistro', v)} />
              <Field label="País" value={formData.pais || 'Perú'} onChange={v => updateField('pais', v)} />
            </>
          )}

          {type === 'postgrado' && (
            <>
              <SelectField label="Nivel *" value={formData.nivel || ''} onChange={v => updateField('nivel', v)} options={['Doctorado', 'Maestría', 'Diplomado', 'Curso de Especialización']} />
              <Field label="Grado *" value={formData.grado || ''} onChange={v => updateField('grado', v)} placeholder="Ej. Magíster en Estadística" />
              <Field label="Nombre del Postgrado / Diplomado *" value={formData.postgrado || ''} onChange={v => updateField('postgrado', v)} />
              <Field label="Centro de Estudios *" value={formData.centroEstudios || ''} onChange={v => updateField('centroEstudios', v)} />
              <Field label="Fecha de Emisión" type="date" value={formData.fechaEmision || ''} onChange={v => updateField('fechaEmision', v)} />
              <Field label="País" value={formData.pais || 'Perú'} onChange={v => updateField('pais', v)} />
            </>
          )}

          {type === 'educacionComp' && (
            <>
              <Field label="Estudio Realizado *" value={formData.estudioRealizado || ''} onChange={v => updateField('estudioRealizado', v)} placeholder="Ej. Taller de R y Python" />
              <Field label="Centro de Estudios *" value={formData.centroEstudios || ''} onChange={v => updateField('centroEstudios', v)} />
              <Field label="Duración (Horas / Meses)" value={formData.duracion || ''} onChange={v => updateField('duracion', v)} placeholder="Ej. 120 horas" />
              <Field label="Fecha de Emisión" type="date" value={formData.fechaEmision || ''} onChange={v => updateField('fechaEmision', v)} />
              <Field label="País" value={formData.pais || 'Perú'} onChange={v => updateField('pais', v)} />
            </>
          )}

          {type === 'idioma' && (
            <>
              <Field label="Idioma / Lengua *" value={formData.idioma || ''} onChange={v => updateField('idioma', v)} placeholder="Ej. Inglés / Quechua" />
              <SelectField label="Nivel de Dominio *" value={formData.nivelDominio || ''} onChange={v => updateField('nivelDominio', v)} options={['Básico', 'Intermedio', 'Avanzado', 'Nativo']} />
            </>
          )}

          {type === 'expInei' && (
            <>
              <Field label="Dependencia INEI *" value={formData.dependencia || ''} onChange={v => updateField('dependencia', v)} placeholder="Ej. Dirección Nacional de Censos" />
              <Field label="Cargo Contractual *" value={formData.cargoContractual || ''} onChange={v => updateField('cargoContractual', v)} />
              <Field label="Número de Contrato" value={formData.numeroContrato || ''} onChange={v => updateField('numeroContrato', v)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Field label="Fecha Inicio" type="date" value={formData.fechaInicio || ''} onChange={v => updateField('fechaInicio', v)} />
                <Field label="Fecha Fin" type="date" value={formData.fechaFin || ''} onChange={v => updateField('fechaFin', v)} />
              </div>
            </>
          )}

          {type === 'otraExp' && (
            <>
              <Field label="Institución o Empresa *" value={formData.institucion || ''} onChange={v => updateField('institucion', v)} />
              <Field label="Cargo Desempeñado *" value={formData.cargo || ''} onChange={v => updateField('cargo', v)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Field label="Fecha Inicio" type="date" value={formData.fechaInicio || ''} onChange={v => updateField('fechaInicio', v)} />
                <Field label="Fecha Fin" type="date" value={formData.fechaFin || ''} onChange={v => updateField('fechaFin', v)} />
              </div>
              <Field label="Tiempo Calculado" value={formData.tiempo || ''} onChange={v => updateField('tiempo', v)} placeholder="Ej. 1 año y 3 meses" />
            </>
          )}

          {type === 'merito' && (
            <>
              <Field label="Tipo de Documento *" value={formData.tipoDocumento || ''} onChange={v => updateField('tipoDocumento', v)} placeholder="Ej. Resolución Directoral / Diploma" />
              <Field label="Institución *" value={formData.institucion || ''} onChange={v => updateField('institucion', v)} />
              <Field label="Título del Reconocimiento *" value={formData.tituloMerito || ''} onChange={v => updateField('tituloMerito', v)} />
              <Field label="Fecha" type="date" value={formData.fechaMerito || ''} onChange={v => updateField('fechaMerito', v)} />
            </>
          )}

          {type === 'publicacion' && (
            <>
              <Field label="Título de la Publicación *" value={formData.titulo || ''} onChange={v => updateField('titulo', v)} />
              <SelectField label="Tipo *" value={formData.tipo || ''} onChange={v => updateField('tipo', v)} options={['Libro', 'Artículo Científico', 'Ensayo', 'Manual', 'Otro']} />
              <Field label="Fecha de Publicación" type="date" value={formData.fecha || ''} onChange={v => updateField('fecha', v)} />
            </>
          )}

          {type === 'docAdicional' && (
            <>
              <SelectField label="Documento Adicional *" value={formData.documento || ''} onChange={v => updateField('documento', v)} options={['Licenciado FF.AA.', 'Discapacidad (CONADIS)', 'Deportista Calificado', 'Licencia de Conducir', 'Colegiatura', 'Record de Conductor']} />
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#FFF' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-gold" style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}