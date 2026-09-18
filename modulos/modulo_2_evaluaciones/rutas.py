# modulos/modulo_2_evaluaciones/rutas.py
import os
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text

from registro import schemas, models

# Importamos las funciones con la lógica de negocio desde evaluador.py
from modulos.modulo_2_evaluaciones import evaluador as eval_service
from BD.database import get_db, get_db_connection

# 1. Crear el Router
router = APIRouter(
    prefix="/api",
    tags=["Módulo 2 - Evaluaciones / Exámenes / Inscripción sujeto a examen"]
)

# 2. Modelos de Datos (Pydantic)
class SolicitudExamen(BaseModel):
    curso_prerrequisito: str
    curso_destino: str
    silabo: str
    
class RespuestasAlumnoRequest(BaseModel):
    examen: Dict[str, Any]
    respuestas_usuario: Dict[str, str]
    alumno_id: Optional[str] = "EST-001"

# 3. Endpoints del Módulo 2

@router.get("/cursos")
def listar_cursos():
    """Obtiene el listado completo de cursos directamente desde PostgreSQL."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Consultar la tabla de cursos en el esquema enei
        query = "SELECT * FROM enei.programas;"
        cur.execute(query)
        cursos = cur.fetchall()
        
        cur.close()
        conn.close()

        # Convertir a lista de diccionarios
        cursos_dict = [dict(c) for c in cursos]
        return {"status": "success", "data": cursos_dict}

    except Exception as e:
        print(f"❌ Error al consultar cursos en PostgreSQL")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al obtener los cursos desde PostgreSQL"
        )

@router.post("/generar-examen")
def generar_examen(datos: SolicitudExamen):
    """Envía los datos a Gemini para generar el examen de suficiencia."""
    try:
        resultado = eval_service.generar_examen_ia(
            curso_prerrequisito=datos.curso_prerrequisito,
            curso_destino=datos.curso_destino,
            silabo=datos.silabo
        )
        return {"status": "success", "examen": resultado}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al generar el examen con Gemini"
        )
        
@router.post("/calificar-examen")
def calificar_examen(
    datos: RespuestasAlumnoRequest, 
    db: Session = Depends(get_db)
):
    """
    Recibe las respuestas del estudiante, evalúa su nivel cognitivo (Bloom)
    y devuelve la calificación junto a cursos sugeridos si resulta NO APTO.
    """
    try:
        examen = datos.examen.get("examen", {})
        preguntas = examen.get("preguntas", [])
        respuestas_usuario = datos.respuestas_usuario

        puntaje_obtenido = 0
        total_preguntas = len(preguntas)
        
        # Si no hay preguntas, evita la división por cero
        if total_preguntas == 0:
            return {
                "estado": "NO APTO",
                "puntaje_obtenido": 0,
                "puntaje_corte": 0,
                "resumen_por_nivel": [],
                "cursos_sugeridos": []
            }

        puntaje_corte = int(total_preguntas * 0.7)  # 70% necesario para aprobar
        resumen_bloom = {}

        # Evaluar respuestas
        for pregunta in preguntas:
            p_id = str(pregunta.get("id"))
            nivel = pregunta.get("nivel_bloom", "General")
            respuesta_correcta = str(pregunta.get("respuesta_correcta", "")).strip().upper()
            respuesta_usuario = str(respuestas_usuario.get(p_id, "")).strip().upper()

            if nivel not in resumen_bloom:
                resumen_bloom[nivel] = {"nivel_bloom": nivel, "correctas": 0, "total": 0}
            
            resumen_bloom[nivel]["total"] += 1

            if respuesta_usuario and respuesta_usuario == respuesta_correcta:
                puntaje_obtenido += 1
                resumen_bloom[nivel]["correctas"] += 1

        estado = "APTO" if puntaje_obtenido >= puntaje_corte else "NO APTO"
        cursos_sugeridos = []

        # Si el estudiante NO ES APTO, extraemos sugerencias de PostgreSQL
        if estado == "NO APTO":
            prereq_evaluado = datos.examen.get("prerequisitos", "")
            param_busqueda = f"%{prereq_evaluado[:10]}%" if prereq_evaluado else "%Estadística%"

            query_sql = text("""
                SELECT codigo, titulo, descripcion 
                FROM enei.programas 
                WHERE LOWER(titulo) LIKE LOWER(:query) 
                   OR LOWER(prerequisitos) LIKE LOWER(:query)
                LIMIT 3;
            """)
            
            resultado_db = db.execute(query_sql, {"query": param_busqueda}).mappings().fetchall()

            cursos_sugeridos = [
                {
                    "codigo": row["codigo"],
                    "titulo": row["titulo"],
                    "descripcion_corta": (row["descripcion"][:90] + "...") if row["descripcion"] else "Curso sugerido de nivelación."
                }
                for row in resultado_db
            ]

        return {
            "estado": estado,
            "puntaje_obtenido": puntaje_obtenido,
            "puntaje_corte": puntaje_corte,
            "resumen_por_nivel": list(resumen_bloom.values()),
            "cursos_sugeridos": cursos_sugeridos
        }

    except Exception as e:
        print(f"❌ Error en /calificar-examen")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar la calificación"
        )
        
@router.post("/inscripciones", status_code=status.HTTP_201_CREATED)
def registrar_inscripcion(
    datos: schemas.InscripcionSchema, 
    db: Session = Depends(get_db)
):
    """Registra la matrícula de un alumno a un programa académico."""
    try:
        # Validar si el usuario ya está inscrito en este programa
        inscripcion_existente = db.query(models.Inscripcion).filter(
            models.Inscripcion.usuario_id == datos.usuario_id,
            models.Inscripcion.codigo_programa == datos.codigo_programa
        ).first()

        if inscripcion_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya se encuentra matriculado en este programa."
            )

        # Crear y guardar el registro de inscripción
        nueva_inscripcion = models.Inscripcion(
            usuario_id=datos.usuario_id,
            codigo_programa=datos.codigo_programa
        )

        db.add(nueva_inscripcion)
        db.commit()
        db.refresh(nueva_inscripcion)

        return {
            "status": "ok",
            "message": "Inscripción realizada con éxito",
            "inscripcion_id": nueva_inscripcion.id
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar inscripción"
        )