from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import or_
from BD.database import engine, Base, get_db
from . import models, schemas
from passlib.context import CryptContext
from registro.cv_parser import extraer_datos_cv_bytes

# Crea las tablas en PostgreSQL si no existen
models.Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario_data: schemas.UsuarioRegisterSchema, db: Session = Depends(get_db)):
    # 1. Validar si ya existe por DNI o Correo (Validación de Acceso Único)
    usuario_existente = db.query(models.Usuario).filter(
        (models.Usuario.correo == usuario_data.correo) | 
        (models.Usuario.dni_documento == usuario_data.dni_documento)
    ).first()

    if usuario_existente:
        raise HTTPException(
            status_code=400, 
            detail="El correo electrónico o DNI ya se encuentra registrado."
        )

    # 2. Hash de contraseña
    hashed_pwd = pwd_context.hash(usuario_data.password)

    # 3. Crear Entidad Usuario
    nuevo_usuario = models.Usuario(
        nombres=usuario_data.nombres,
        apellido_paterno=usuario_data.apellido_paterno,
        apellido_materno=usuario_data.apellido_materno,
        dni_documento=usuario_data.dni_documento,
        correo=usuario_data.correo,
        password_hash=hashed_pwd
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    return {
        "mensaje": "Usuario registrado exitosamente",
        "usuario_id": {
            "id": nuevo_usuario.id,
            "nombres": nuevo_usuario.nombres,
            "apellido_paterno": nuevo_usuario.apellido_paterno,
            "apellido_materno": nuevo_usuario.apellido_materno,
            "correo": nuevo_usuario.correo
        }
    }

# -------------------------------------------------------------
#             OBTENER DATOS DEL PERFIL DEL USUARIO
# -------------------------------------------------------------
@router.get("/perfil/{usuario_id}", status_code=status.HTTP_200_OK)
def obtener_perfil(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "personal": {
            "apellidoPaterno": usuario.apellido_paterno or "",
            "apellidoMaterno": usuario.apellido_materno or "",
            "nombres": usuario.nombres or "",
            "tipoDoc": usuario.tipo_doc or "",
            "nroDoc": usuario.dni_documento or "",
            "fechaNacimiento": str(usuario.fecha_nacimiento) if usuario.fecha_nacimiento else "",
            "estadoCivil": usuario.estado_civil or "",
            "sexo": usuario.sexo or "",
            "ruc": usuario.ruc or "",
            "correo": usuario.correo or "",
            "movil": usuario.movil or "",
            "telefonoFijo": usuario.telefono_fijo or "",
            "paisNacimiento": usuario.pais_nacimiento or "",
            "lugarNacimiento": usuario.lugar_nacimiento or "",
            "direccion": usuario.direccion or "",
            "lugarResidencia": usuario.lugar_residencia or ""
        },
        "academico": {
            "nivelesAcademicos": usuario.niveles_academicos if hasattr(usuario, 'niveles_academicos') else [],
            "postgrados": usuario.postgrados if hasattr(usuario, 'postgrados') else [],
            "educacionComp": usuario.educacion_complementaria if hasattr(usuario, 'educacion_complementaria') else [],
            "idiomas": usuario.idiomas if hasattr(usuario, 'idiomas') else []
        },
        "laboral": {
            "expInei": usuario.exp_inei if hasattr(usuario, 'exp_inei') else [],
            "otrasExp": usuario.otras_exp if hasattr(usuario, 'otras_exp') else [],
            "meritos": usuario.meritos if hasattr(usuario, 'meritos') else [],
            "publicaciones": usuario.publicaciones if hasattr(usuario, 'publicaciones') else [],
            "docsAdicionales": usuario.docs_adicionales if hasattr(usuario, 'docs_adicionales') else [],
            "habilidades": usuario.habilidades or ""
        }
    }

@router.post("/completar_perfil", status_code=status.HTTP_200_OK)
def completar_perfil(datos: schemas.CompletarPerfilSchema, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == datos.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 1. Actualizar Datos Personales
    p = datos.personal
    usuario.apellido_paterno = p.apellidoPaterno
    usuario.apellido_materno = p.apellidoMaterno
    usuario.nombres = p.nombres
    usuario.tipo_doc = p.tipoDoc
    usuario.dni_documento = p.nroDoc
    usuario.fecha_nacimiento = p.fechaNacimiento
    usuario.estado_civil = p.estadoCivil
    usuario.sexo = p.sexo
    usuario.ruc = p.ruc
    usuario.correo = p.correo
    usuario.movil = p.movil
    usuario.telefono_fijo = p.telefonoFijo
    usuario.pais_nacimiento = p.paisNacimiento
    usuario.lugar_nacimiento = p.lugarNacimiento
    usuario.direccion = p.direccion
    usuario.lugar_residencia = p.lugarResidencia
    usuario.habilidades = datos.laboral.habilidades

    # 2. Limpiar registros previos para actualizar (Estrategia Re-Sync)
    db.query(models.NivelAcademico).filter_by(usuario_id=usuario.id).delete()
    db.query(models.Postgrado).filter_by(usuario_id=usuario.id).delete()
    db.query(models.EducacionComplementaria).filter_by(usuario_id=usuario.id).delete()
    db.query(models.Idioma).filter_by(usuario_id=usuario.id).delete()
    db.query(models.ExperienciaInei).filter_by(usuario_id=usuario.id).delete()
    db.query(models.OtraExperiencia).filter_by(usuario_id=usuario.id).delete()
    db.query(models.Merito).filter_by(usuario_id=usuario.id).delete()
    db.query(models.Publicacion).filter_by(usuario_id=usuario.id).delete()
    db.query(models.DocumentoAdicional).filter_by(usuario_id=usuario.id).delete()

    # 3. Guardar Bloque Académico
    for item in datos.academico.nivelesAcademicos:
        db.add(models.NivelAcademico(
            usuario_id=usuario.id, nivel=item.nivel, carrera=item.carrera,
            centro_estudios=item.centroEstudios, grado=item.grado, ciclo=item.ciclo,
            fecha_emision=item.fechaEmision, nro_registro=item.nroRegistro, pais=item.pais
        ))

    for item in datos.academico.postgrados:
        db.add(models.Postgrado(
            usuario_id=usuario.id, nivel=item.nivel, grado=item.grado,
            postgrado=item.postgrado, centro_estudios=item.centroEstudios,
            fecha_emision=item.fechaEmision, pais=item.pais
        ))

    for item in datos.academico.educacionComp:
        db.add(models.EducacionComplementaria(
            usuario_id=usuario.id, estudio_realizado=item.estudioRealizado,
            centro_estudios=item.centroEstudios, duracion=item.duracion,
            fecha_emision=item.fechaEmision, pais=item.pais
        ))

    for item in datos.academico.idiomas:
        db.add(models.Idioma(usuario_id=usuario.id, idioma=item.idioma, nivel_dominio=item.nivelDominio))

    # 4. Guardar Bloque Laboral
    for item in datos.laboral.expInei:
        db.add(models.ExperienciaInei(
            usuario_id=usuario.id, dependencia=item.dependencia, cargo_contractual=item.cargoContractual,
            cargo_funcional=item.cargoFuncional, numero_contrato=item.numeroContrato,
            tipo_planilla=item.tipoPlanilla, fecha_inicio=item.fechaInicio, fecha_fin=item.fechaFin
        ))

    for item in datos.laboral.otrasExp:
        db.add(models.OtraExperiencia(
            usuario_id=usuario.id, institucion=item.institucion, cargo=item.cargo,
            fecha_inicio=item.fechaInicio, fecha_fin=item.fechaFin, tiempo=item.tiempo
        ))

    for item in datos.laboral.meritos:
        db.add(models.Merito(
            usuario_id=usuario.id, tipo_documento=item.tipoDocumento,
            institucion=item.institucion, titulo_merito=item.tituloMerito, fecha_merito=item.fechaMerito
        ))

    for item in datos.laboral.publicaciones:
        db.add(models.Publicacion(
            usuario_id=usuario.id, titulo=item.titulo, tipo=item.tipo, fecha=item.fecha
        ))

    for item in datos.laboral.docsAdicionales:
        db.add(models.DocumentoAdicional(
            usuario_id=usuario.id, documento=item.documento
        ))

    db.commit()
    return {"mensaje": "Perfil y legajo personal guardados correctamente"}

# -------------------------------------------------------------
# 2. ENDPOINT DE LOGIN 
# -------------------------------------------------------------
@router.post("/login", status_code=status.HTTP_200_OK)
def iniciar_sesion(credentials: schemas.LoginSchema, db: Session = Depends(get_db)):
    # 1. Buscar al usuario en la base de datos por correo
    usuario = db.query(models.Usuario).filter(models.Usuario.correo == credentials.correo).first()

    # 2. Verificar que el usuario exista y validar su contraseña hash
    if not usuario or not pwd_context.verify(credentials.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos."
        )

    # 3. Comprobar si el usuario está activo (opcional según tu modelo)
    if hasattr(usuario, "is_active") and not usuario.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta se encuentra inactiva."
        )

    # 4. Devolver la respuesta exitosa con los datos requeridos por el frontend
    return {
        "mensaje": "Inicio de sesión exitoso",
        "usuario": {
            "id": usuario.id,
            "nombres": usuario.nombres,
            "apellido_paterno": usuario.apellido_paterno,
            "apellido_materno": usuario.apellido_materno,
            "correo": usuario.correo,
            "dni_documento": usuario.dni_documento
        }
    }
    
# -------------------------------------------------------------
# 3. EXTRAER CV 
# -------------------------------------------------------------

@router.post("/extraer_cv")
async def procesar_cv_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos en formato PDF")

    try:
        contenido_bytes = await file.read()
        datos_cv = extraer_datos_cv_bytes(contenido_bytes)
        return datos_cv
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al analizar el CV: {str(e)}")