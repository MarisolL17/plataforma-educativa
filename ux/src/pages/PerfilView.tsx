// src/pages/PerfilView.tsx
import React, { useState, useEffect } from 'react';
import { NAVY, SKY, GOLD, MUTED, BORDER } from '../constants/colors';
import { Field } from '../components/Common/Field';
import { SelectField } from '../components/Common/SelectField';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ==========================================
// INTERFACES
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

export function PerfilView({ usuarioId, initialData, onVolver }: PerfilViewProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState({ text: '', isError: false });
  const [activeTab, setActiveTab] = useState<'personal' | 'academico' | 'laboral'>('personal');

  // ==========================================
  // ESTADOS: INFORMACIÓN PERSONAL
  // ==========================================
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres]                 = useState('');
  const [tipoDoc, setTipoDoc]                 = useState('DNI');
  const [nroDoc, setNroDoc]                   = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [estadoCivil, setEstadoCivil]         = useState('');
  const [sexo, setSexo]                       = useState('');
  const [ruc, setRuc]                         = useState('');
  const [correo, setCorreo]                   = useState('');
  const [movil, setMovil]                     = useState('');
  const [telefonoFijo, setTelefonoFijo]       = useState('');
  const [paisNacimiento, setPaisNacimiento]   = useState('Perú');
  const [lugarNacimiento, setLugarNacimiento] = useState('');
  const [direccion, setDireccion]             = useState('');
  const [lugarResidencia, setLugarResidencia] = useState('');

  // ==========================================
  // ESTADOS: CUADROS ACADÉMICOS Y LABORALES
  // ==========================================
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademicoItem[]>([]);
  const [postgrados, setPostgrados]               = useState<PostgradoItem[]>([]);
  const [educacionComp, setEducacionComp]         = useState<EducacionComplementariaItem[]>([]);
  const [idiomas, setIdiomas]                     = useState<IdiomaItem[]>([]);
  const [expInei, setExpInei]                     = useState<ExperienciaIneiItem[]>([]);
  const [otrasExp, setOtrasExp]                   = useState<OtraExperienciaItem[]>([]);
  const [meritos, setMeritos]                     = useState<MeritoItem[]>([]);
  const [publicaciones, setPublicaciones]         = useState<PublicacionItem[]>([]);
  const [docsAdicionales, setDocsAdicionales]     = useState<DocumentoAdicionalItem[]>([]);
  const [habilidades, setHabilidades]             = useState('');

  // ==========================================
  // CARGA Y SINCRONIZACIÓN DE DATOS
  // ==========================================
  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);

      const storedUser = localStorage.getItem('usuario');
      const localUser = storedUser ? JSON.parse(storedUser) : null;
      const dataFuente = initialData || localUser;

      const pInit = initialData?.personal || dataFuente || {};
      setApellidoPaterno(pInit.apellidoPaterno || pInit.apellido_paterno || '');
      setApellidoMaterno(pInit.apellidoMaterno || pInit.apellido_materno || '');
      setNombres(pInit.nombres || pInit.nombre || '');
      setTipoDoc(pInit.tipoDoc || pInit.tipo_doc || 'DNI');
      setNroDoc(pInit.nroDoc || pInit.dni_documento || pInit.dni || '');
      setFechaNacimiento(pInit.fechaNacimiento || pInit.fecha_nacimiento || '');
      setEstadoCivil(pInit.estadoCivil || pInit.estado_civil || '');
      setSexo(pInit.sexo || '');
      setRuc(pInit.ruc || '');
      setCorreo(pInit.correo || pInit.email || '');
      setMovil(pInit.movil || pInit.telefono || '');
      setTelefonoFijo(pInit.telefonoFijo || pInit.telefono_fijo || '');
      setPaisNacimiento(pInit.paisNacimiento || pInit.pais_nacimiento || 'Perú');
      setLugarNacimiento(pInit.lugarNacimiento || pInit.lugar_nacimiento || '');
      setDireccion(pInit.direccion || '');
      setLugarResidencia(pInit.lugarResidencia || pInit.lugar_residencia || '');

      if (initialData?.academico) {
        setNivelesAcademicos(initialData.academico.nivelesAcademicos || []);
        setPostgrados(initialData.academico.postgrados || []);
        setEducacionComp(initialData.academico.educacionComp || []);
        setIdiomas(initialData.academico.idiomas || []);
      }

      if (initialData?.laboral) {
        setExpInei(initialData.laboral.expInei || []);
        setOtrasExp(initialData.laboral.otrasExp || []);
        setMeritos(initialData.laboral.meritos || []);
        setPublicaciones(initialData.laboral.publicaciones || []);
        setDocsAdicionales(initialData.laboral.docsAdicionales || []);
        setHabilidades(initialData.laboral.habilidades || initialData.laboral.skills || '');
      }

      const targetId = usuarioId || localUser?.id;
      if (!targetId || initialData) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/v1/auth/perfil/${targetId}`);
        if (response.ok) {
          const data = await response.json();
          const p = data.personal || {};

          if (p && Object.keys(p).length > 0) {
            setApellidoPaterno(p.apellidoPaterno || p.apellido_paterno || '');
            setApellidoMaterno(p.apellidoMaterno || p.apellido_materno || '');
            setNombres(p.nombres || p.nombre || '');
            setTipoDoc(p.tipoDoc || p.tipo_doc || 'DNI');
            setNroDoc(p.nroDoc || p.dni_documento || p.dni || '');
            setFechaNacimiento(p.fechaNacimiento || p.fecha_nacimiento || '');
            setEstadoCivil(p.estadoCivil || p.estado_civil || '');
            setSexo(p.sexo || '');
            setRuc(p.ruc || '');
            setCorreo(p.correo || p.email || '');
            setMovil(p.movil || p.telefono || '');
            setTelefonoFijo(p.telefonoFijo || p.telefono_fijo || '');
            setPaisNacimiento(p.paisNacimiento || p.pais_nacimiento || 'Perú');
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
            setHabilidades(data.laboral.habilidades || data.laboral.skills || '');
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
  // GESTIÓN DE MODALES DINÁMICOS (CREAR Y EDITAR)
  // ==========================================
  const [modalType, setModalType]       = useState<string | null>(null);
  const [formData, setFormData]         = useState<any>({});
  const [editingId, setEditingId]       = useState<string | null>(null); // ID del objeto siendo editado

  const openModalForCreate = (type: string) => {
    setFormData({});
    setEditingId(null);
    setModalType(type);
  };

  const openModalForEdit = (type: string, item: any) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({});
    setEditingId(null);
  };

  const handleSaveModalItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Función auxiliar para actualizar o agregar ítem en una lista
    const updateOrAdd = (list: any[], setList: Function) => {
      if (editingId) {
        setList(list.map(i => i.id === editingId ? { ...formData, id: editingId } : i));
      } else {
        const newItem = { ...formData, id: Date.now().toString() };
        setList([...list, newItem]);
      }
    };

    switch (modalType) {
      case 'nivelAcademico': updateOrAdd(nivelesAcademicos, setNivelesAcademicos); break;
      case 'postgrado':      updateOrAdd(postgrados, setPostgrados); break;
      case 'educacionComp':  updateOrAdd(educacionComp, setEducacionComp); break;
      case 'idioma':         updateOrAdd(idiomas, setIdiomas); break;
      case 'expInei':        updateOrAdd(expInei, setExpInei); break;
      case 'otraExp':        updateOrAdd(otrasExp, setOtrasExp); break;
      case 'merito':         updateOrAdd(meritos, setMeritos); break;
      case 'publicacion':    updateOrAdd(publicaciones, setPublicaciones); break;
      case 'docAdicional':   updateOrAdd(docsAdicionales, setDocsAdicionales); break;
      default: break;
    }
    closeModal();
  };

  // ==========================================
  // GUARDAR TODO EL PERFIL
  // ==========================================
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', isError: false });

    const storedUserStr = localStorage.getItem('usuario');
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
    const targetId = Number(usuarioId || storedUser?.id || 1);

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
        throw new Error(data.detail || `Error ${response.status}: No se pudo guardar la información.`);
      }

      setMsg({ text: '¡Perfil actualizado exitosamente!', isError: false });
      setTimeout(() => {
        if (onVolver) onVolver();
      }, 1200);
    } catch (err: any) {
      setMsg({ text: err?.message || 'Error al guardar los datos', isError: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Montserrat', fontWeight: 600, color: NAVY }}>Cargando legajo del usuario...</p>
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
              ← Volver
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

        {/* PESTAÑAS */}
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
          
          {/* INFORMACIÓN PERSONAL */}
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

          {/* PERFIL ACADÉMICO */}
          {activeTab === 'academico' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <TableCard
                title="Cuadro 1: Nivel Académico"
                subtitle="Título Profesional, Bachiller, Egresado o Secundaria"
                onAdd={() => openModalForCreate('nivelAcademico')}
                onEdit={(item) => openModalForEdit('nivelAcademico', item)}
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
                onAdd={() => openModalForCreate('postgrado')}
                onEdit={(item) => openModalForEdit('postgrado', item)}
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
                onAdd={() => openModalForCreate('educacionComp')}
                onEdit={(item) => openModalForEdit('educacionComp', item)}
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
                onAdd={() => openModalForCreate('idioma')}
                onEdit={(item) => openModalForEdit('idioma', item)}
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

          {/* PERFIL LABORAL & MÉRITOS */}
          {activeTab === 'laboral' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <TableCard
                title="Cuadro 1: Experiencia Laboral INEI"
                subtitle="Información extraída o acreditada de contrataciones en INEI"
                onAdd={() => openModalForCreate('expInei')}
                onEdit={(item) => openModalForEdit('expInei', item)}
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
                onAdd={() => openModalForCreate('otraExp')}
                onEdit={(item) => openModalForEdit('otraExp', item)}
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
                onAdd={() => openModalForCreate('merito')}
                onEdit={(item) => openModalForEdit('merito', item)}
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
                onAdd={() => openModalForCreate('publicacion')}
                onEdit={(item) => openModalForEdit('publicacion', item)}
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
                onAdd={() => openModalForCreate('docAdicional')}
                onEdit={(item) => openModalForEdit('docAdicional', item)}
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

          {/* BOTÓN GENERAL */}
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
          isEditing={!!editingId}
          setFormData={setFormData}
          onClose={closeModal}
          onSave={handleSaveModalItem}
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

interface TableCardProps {
  title: string;
  subtitle: string;
  onAdd: () => void;
  onEdit: (item: any) => void;
  headers: string[];
  items: any[];
  renderRow: (item: any) => React.ReactNode;
  onDelete: (id: string) => void;
}

function TableCard({ title, subtitle, onAdd, onEdit, headers, items, renderRow, onDelete }: TableCardProps) {
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
                <tr key={item.id || idx} style={{ borderBottom: `1px solid ${BORDER}`, background: idx % 2 === 0 ? '#FFF' : '#F8FAFC' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600, color: NAVY }}>{idx + 1}</td>
                  {renderRow(item)}
                  <td style={{ padding: '0.5rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button type="button" onClick={() => onEdit(item)} title="Editar ítem" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                      ✏️
                    </button>
                    <button type="button" onClick={() => onDelete(item.id)} title="Eliminar ítem" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem' }}>
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

function DynamicModal({ type, formData, isEditing, setFormData, onClose, onSave }: any) {
  const updateField = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#FFF', borderRadius: 12, padding: '1.75rem', maxWidth: 500, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
        <h4 style={{ fontFamily: 'Montserrat', fontWeight: 700, color: NAVY, marginBottom: '1rem' }}>
          {isEditing ? '✏️ Editar registro' : '➕ Registrar nuevo ítem'}
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
              {isEditing ? 'Guardar Cambios' : 'Guardar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}