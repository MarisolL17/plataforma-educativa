from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

# --- Registro & Login Básico ---
class UsuarioRegisterSchema(BaseModel):
    nombres: str
    apellido_paterno: str
    apellido_materno: str
    dni_documento: str
    correo: EmailStr
    password: str

class LoginSchema(BaseModel):
    correo: EmailStr
    password: str

# --- Esquemas Internos para Listas ---
class NivelAcademicoSchema(BaseModel):
    nivel: str
    carrera: str
    centroEstudios: str
    grado: str
    ciclo: Optional[str] = None
    fechaEmision: Optional[str] = None
    nroRegistro: Optional[str] = None
    pais: Optional[str] = None

class PostgradoSchema(BaseModel):
    nivel: str
    grado: str
    postgrado: str
    centroEstudios: str
    fechaEmision: Optional[str] = None
    pais: Optional[str] = None

class EducacionCompSchema(BaseModel):
    estudioRealizado: str
    centroEstudios: str
    duracion: Optional[str] = None
    fechaEmision: Optional[str] = None
    pais: Optional[str] = None

class IdiomaSchema(BaseModel):
    idioma: str
    nivelDominio: str

class ExpIneiSchema(BaseModel):
    dependencia: str
    cargoContractual: str
    cargoFuncional: Optional[str] = None
    numeroContrato: Optional[str] = None
    tipoPlanilla: Optional[str] = None
    fechaInicio: Optional[str] = None
    fechaFin: Optional[str] = None

class OtraExpSchema(BaseModel):
    institucion: str
    cargo: str
    fechaInicio: Optional[str] = None
    fechaFin: Optional[str] = None
    tiempo: Optional[str] = None

class MeritoSchema(BaseModel):
    tipoDocumento: str
    institucion: str
    tituloMerito: str
    fechaMerito: Optional[str] = None

class PublicacionSchema(BaseModel):
    titulo: str
    tipo: str
    fecha: Optional[str] = None

class DocAdicionalSchema(BaseModel):
    documento: str

# --- Esquema Principal de Guardado ---
class PersonalDataSchema(BaseModel):
    apellidoPaterno: Optional[str] = None
    apellidoMaterno: Optional[str] = None
    nombres: str
    tipoDoc: Optional[str] = None
    nroDoc: str
    fechaNacimiento: Optional[str] = None
    estadoCivil: Optional[str] = None
    sexo: Optional[str] = None
    ruc: Optional[str] = None
    correo: EmailStr
    movil: Optional[str] = None
    telefonoFijo: Optional[str] = None
    paisNacimiento: Optional[str] = None
    lugarNacimiento: Optional[str] = None
    direccion: Optional[str] = None
    lugarResidencia: Optional[str] = None

class AcademicoGroupSchema(BaseModel):
    nivelesAcademicos: List[NivelAcademicoSchema] = []
    postgrados: List[PostgradoSchema] = []
    educacionComp: List[EducacionCompSchema] = []
    idiomas: List[IdiomaSchema] = []

class LaboralGroupSchema(BaseModel):
    expInei: List[ExpIneiSchema] = []
    otrasExp: List[OtraExpSchema] = []
    meritos: List[MeritoSchema] = []
    publicaciones: List[PublicacionSchema] = []
    docsAdicionales: List[DocAdicionalSchema] = []
    habilidades: Optional[str] = None

class CompletarPerfilSchema(BaseModel):
    usuario_id: int
    personal: PersonalDataSchema
    academico: AcademicoGroupSchema
    laboral: LaboralGroupSchema
    
class CalificarExamenSchema(BaseModel):
    examen_data: Dict[str, Any]
    respuestas: Dict[str, str]
    
class InscripcionSchema(BaseModel):
    usuario_id: int
    codigo_programa: str