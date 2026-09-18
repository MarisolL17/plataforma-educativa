#---------------------------------------------------------------
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from BD.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    # Datos de Acceso
    correo = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    # Identificación & Datos Personales
    apellido_paterno = Column(String(100), nullable=True)
    apellido_materno = Column(String(100), nullable=True)
    nombres = Column(String(100), nullable=False)
    tipo_doc = Column(String(50), default="DNI")
    dni_documento = Column(String(20), unique=True, nullable=False, index=True)
    fecha_nacimiento = Column(String(20), nullable=True)
    estado_civil = Column(String(50), nullable=True)
    sexo = Column(String(20), nullable=True)
    ruc = Column(String(20), nullable=True)
    movil = Column(String(20), nullable=True)
    telefono_fijo = Column(String(20), nullable=True)
    pais_nacimiento = Column(String(100), default="Perú")
    lugar_nacimiento = Column(String(200), nullable=True)
    direccion = Column(String(250), nullable=True)
    lugar_residencia = Column(String(200), nullable=True)

    # Habilidades / Conocimientos generales
    habilidades = Column(Text, nullable=True)

    # RELACIONES 1-a-N (Listas Dinámicas por Cuadros)
    niveles_academicos = relationship("NivelAcademico", back_populates="usuario", cascade="all, delete-orphan")
    postgrados = relationship("Postgrado", back_populates="usuario", cascade="all, delete-orphan")
    educacion_comp = relationship("EducacionComplementaria", back_populates="usuario", cascade="all, delete-orphan")
    idiomas = relationship("Idioma", back_populates="usuario", cascade="all, delete-orphan")
    exp_inei = relationship("ExperienciaInei", back_populates="usuario", cascade="all, delete-orphan")
    otras_exp = relationship("OtraExperiencia", back_populates="usuario", cascade="all, delete-orphan")
    meritos = relationship("Merito", back_populates="usuario", cascade="all, delete-orphan")
    publicaciones = relationship("Publicacion", back_populates="usuario", cascade="all, delete-orphan")
    docs_adicionales = relationship("DocumentoAdicional", back_populates="usuario", cascade="all, delete-orphan")


# ==========================================
# TABLAS ACADÉMICAS
# ==========================================

class NivelAcademico(Base):
    __tablename__ = "niveles_academicos"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    nivel = Column(String(100))
    carrera = Column(String(150))
    centro_estudios = Column(String(200))
    grado = Column(String(100))
    ciclo = Column(String(50), nullable=True)
    fecha_emision = Column(String(20), nullable=True)
    nro_registro = Column(String(100), nullable=True)
    pais = Column(String(100), default="Perú")

    usuario = relationship("Usuario", back_populates="niveles_academicos")


class Postgrado(Base):
    __tablename__ = "postgrados"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    nivel = Column(String(100))
    grado = Column(String(100))
    postgrado = Column(String(200))
    centro_estudios = Column(String(200))
    fecha_emision = Column(String(20), nullable=True)
    pais = Column(String(100), default="Perú")

    usuario = relationship("Usuario", back_populates="postgrados")


class EducacionComplementaria(Base):
    __tablename__ = "educacion_complementaria"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    estudio_realizado = Column(String(200))
    centro_estudios = Column(String(200))
    duracion = Column(String(100), nullable=True)
    fecha_emision = Column(String(20), nullable=True)
    pais = Column(String(100), default="Perú")

    usuario = relationship("Usuario", back_populates="educacion_comp")


class Idioma(Base):
    __tablename__ = "idiomas"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    idioma = Column(String(100))
    nivel_dominio = Column(String(50))

    usuario = relationship("Usuario", back_populates="idiomas")


# ==========================================
# TABLAS LABORALES Y MÉRITOS
# ==========================================

class ExperienciaInei(Base):
    __tablename__ = "experiencias_inei"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    dependencia = Column(String(200))
    cargo_contractual = Column(String(150))
    cargo_funcional = Column(String(150), nullable=True)
    numero_contrato = Column(String(100), nullable=True)
    tipo_planilla = Column(String(100), nullable=True)
    fecha_inicio = Column(String(20), nullable=True)
    fecha_fin = Column(String(20), nullable=True)

    usuario = relationship("Usuario", back_populates="exp_inei")


class OtraExperiencia(Base):
    __tablename__ = "otras_experiencias"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    institucion = Column(String(200))
    cargo = Column(String(150))
    fecha_inicio = Column(String(20), nullable=True)
    fecha_fin = Column(String(20), nullable=True)
    tiempo = Column(String(100), nullable=True)

    usuario = relationship("Usuario", back_populates="otras_exp")


class Merito(Base):
    __tablename__ = "meritos"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    tipo_documento = Column(String(150))
    institucion = Column(String(200))
    titulo_merito = Column(String(200))
    fecha_merito = Column(String(20), nullable=True)

    usuario = relationship("Usuario", back_populates="meritos")


class Publicacion(Base):
    __tablename__ = "publicaciones"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    titulo = Column(String(250))
    tipo = Column(String(100))
    fecha = Column(String(20), nullable=True)

    usuario = relationship("Usuario", back_populates="publicaciones")


class DocumentoAdicional(Base):
    __tablename__ = "documentos_adicionales"
    __table_args__ = {"schema": "registro"}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("registro.usuarios.id", ondelete="CASCADE"))
    documento = Column(String(150))
    archivo_adjunto = Column(String(255), nullable=True)

    usuario = relationship("Usuario", back_populates="docs_adicionales")
    
    