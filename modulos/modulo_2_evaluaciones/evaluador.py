"""
API Sistema de Evaluación ENEI + Módulo Auxiliar.
- Pipeline de datos: PDFs de contenido temático -> Excel -> SQLite/PostgreSQL.
- SKILL 1: Generación del examen de prerrequisito (Gemini, salida estructurada).
- SKILL 2: Calificación del examen (Gemini / Calificador Local).
- FastAPI REST Endpoints para integración con Frontend (React/Figma).
"""

__version__ = "2.1"

# ==========================================
# 1. IMPORTACIONES Y CONFIGURACIÓN INICIAL
# ==========================================
import os
import sqlite3
import json
import re
import math
import time
from typing import List, Optional

import pdfplumber
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

from google import genai
from google.genai import types

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from BD.database import get_db_connection


# Cargar variables de entorno (.env)
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# Modelos Gemini configurados
MODELO_SKILL = os.getenv("MODELO_IA_GEMINI")

# ==========================================
#      UTILIDADES DEL CLIENTE GEMINI
# ==========================================
def _es_error_de_credencial(e):
    s = str(e).upper()
    return any(t in s for t in ("PERMISSION_DENIED", "UNAUTHENTICATED", "API_KEY", "API KEY", "401", "403"))


def _generar_contenido(model, contents, config):
    """Maneja las peticiones con lógica de reintento automático y respaldo de credenciales."""
    ultimo_error = None
    for intento in range(6):
        try:
            client = genai.Client(api_key=API_KEY)
            return client.models.generate_content(model=model, contents=contents, config=config)
        except Exception as e:
            ultimo_error = e
            s = str(e).upper()
            if "UNAVAILABLE" in s or "503" in s or "OVERLOADED" in s or "INTERNAL" in s:
                time.sleep(5 * (intento + 1))
                continue
            if _es_error_de_credencial(e):
                try:
                    client = genai.Client(vertexai=True, api_key=API_KEY)
                    return client.models.generate_content(model=model, contents=contents, config=config)
                except Exception:
                    raise e
            raise
    raise ultimo_error


def _extraer_json(texto):
    """Extrae o valida el formato JSON devuelto por Gemini."""
    try:
        return json.loads(texto)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", texto, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


# ==========================================
#    LÓGICA DE NEGOCIO Y TAXONOMÍA BLOOM
# ==========================================
MATRIZ_BLOOM = {
    "Procedimental": {"Permisivo": [3, 2, 4, 1, 0], "Estricto": [1, 2, 5, 2, 0]},
    "Mixto":         {"Permisivo": [2, 3, 3, 2, 0], "Estricto": [1, 2, 3, 3, 1]},
    "Conceptual":    {"Permisivo": [1, 4, 2, 3, 0], "Estricto": [0, 2, 2, 4, 2]}
}
NIVELES_BLOOM = ["RECORDAR", "COMPRENDER", "APLICAR", "ANALIZAR", "EVALUAR"]


def calcular_distribucion_bloom(tipo_curso, rigor, total_preguntas=10):
    """Aplica el algoritmo del Resto Mayor para prorratear preguntas de Bloom."""
    pesos = MATRIZ_BLOOM.get(tipo_curso, MATRIZ_BLOOM["Procedimental"])[rigor]
    total_pesos = sum(pesos)
    crudos = [(p / total_pesos) * total_preguntas for p in pesos]
    pisos = [math.floor(c) for c in crudos]
    restante = total_preguntas - sum(pisos)
    
    restos = [(i, crudos[i] - pisos[i]) for i in range(len(crudos))]
    restos.sort(key=lambda x: x[1], reverse=True)
    
    for i in range(restante):
        pisos[restos[i][0]] += 1
        
    textos = []
    for i, nivel in enumerate(NIVELES_BLOOM):
        if pisos[i] > 0:
            textos.append(f"- {pisos[i]} preguntas nivel {nivel}")
            
    return "\n".join(textos)


def clasificar_curso_ia(silabo):
    """Analiza el sílabo y determina si es Procedimental, Conceptual o Mixto."""
    prompt = f"""Lee este sílabo y clasifícalo ESTRICTAMENTE en una de estas tres categorías según la naturaleza de su conocimiento:
    - Procedimental: Se aprende haciendo (software, herramientas, cálculos prácticos).
    - Conceptual: Se aprende entendiendo (teoría, historia, leyes, principios).
    - Mixto: Mezcla equilibrada de teoría y ejecución práctica. 

    Responde ÚNICAMENTE con la palabra exacta de la categoría, sin explicaciones ni puntos.

    SÍLABO:
    {silabo}"""
    
    try:
        respuesta = _generar_contenido(
            model=MODELO_SKILL,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0)
        )
        texto = respuesta.text.strip().capitalize()
        if texto in ["Procedimental", "Conceptual", "Mixto"]:
            return texto
        return "Procedimental"
    except Exception:
        return "Procedimental"


# --- SKILL 1: GENERADOR DE EXÁMENES ---
SKILL1_PROMPT = """Eres un evaluador especialista en diseño de pruebas de competencias para adultos profesionales, que trabaja para la Escuela Nacional de Estadística e Informática (ENEI).
Tu única función es generar exámenes de prerrequisito en formato JSON estricto.

TU ROL
Recibirás el sílabo de un curso prerrequisito, el nombre del curso, y la configuración dinámica generada por el sistema.
Debes generar exactamente 10 preguntas de opción múltiple ajustando la dificultad (Taxonomía de Bloom) según la MATRIZ DINÁMICA DE DISTRIBUCIÓN.

REGLAS INQUEBRANTABLES
- Genera EXACTAMENTE 10 preguntas.
- Cada pregunta debe tener EXACTAMENTE 4 alternativas.
- Solo UNA alternativa puede ser correcta.
- Todas las preguntas deben basarse únicamente en contenidos explícitos del sílabo.
- Nunca inventes temas que no aparezcan en el sílabo.
- Devuelve únicamente el objeto JSON, según el schema de salida configurado.
- No agregues explicaciones fuera del JSON ni uses Markdown.

MATRIZ DINÁMICA DE DISTRIBUCIÓN OBLIGATORIA (Taxonomía de Bloom)
Aplica ESTRICTAMENTE esta distribución en las 10 preguntas, dictada por el usuario en el prompt, sin excepción.

CRITERIO ANTI-ALUCINACIÓN
Si un tema no aparece explícitamente en el sílabo, NO debe aparecer. Si el contenido del sílabo es insuficiente, indícalo brevemente en el campo "advertencia" de metadata.

FORMATO DE SALIDA

El formato de salida está controlado por el responseSchema configurado (no debes generar tu propia estructura de JSON manualmente; sigue el schema). El examen debe incluir total_preguntas = 10 y puntaje_corte = 7, e instrucciones breves para el alumno. En metadata, generado_por debe identificar a este skill y advertencia debe ser "" si no hay nada que advertir.
"""


SKILL1_SCHEMA = {
    "type": "object",
    "properties": {
        "examen": {
            "type": "object",
            "properties": {
                "curso_prerrequisito": {"type": "string"},
                "curso_destino": {"type": "string"},
                "configuracion": {
                    "type": "object",
                    "properties": {
                        "tipo_curso": {"type": "string", "enum": ["Procedimental", "Conceptual", "Mixto"]},
                        "rigor": {"type": "string", "enum": ["Permisivo", "Estricto"]}
                    },
                    "required": ["tipo_curso", "rigor"]
                },
                "total_preguntas": {"type": "integer"},
                "puntaje_corte": {"type": "integer"},
                "instrucciones": {"type": "string"},
                "preguntas": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "nivel_bloom": {"type": "string", "enum": ["RECORDAR", "COMPRENDER", "APLICAR", "ANALIZAR", "EVALUAR"]},
                            "competencia": {"type": "string"},
                            "enunciado": {"type": "string"},
                            "alternativas": {
                                "type": "object",
                                "properties": {
                                    "A": {"type": "string"},
                                    "B": {"type": "string"},
                                    "C": {"type": "string"},
                                    "D": {"type": "string"}
                                },
                                "required": ["A", "B", "C", "D"]
                            },
                            "respuesta_correcta": {"type": "string", "enum": ["A", "B", "C", "D"]},
                            "justificacion": {"type": "string"}
                        },
                        "required": ["id", "nivel_bloom", "competencia", "enunciado", "alternativas", "respuesta_correcta", "justificacion"]
                    }
                }
            },
            "required": ["curso_prerrequisito", "curso_destino", "configuracion", "total_preguntas", "puntaje_corte", "instrucciones", "preguntas"]
        },
        "metadata": {
            "type": "object",
            "properties": {
                "generado_por": {"type": "string"},
                "advertencia": {"type": "string"}
            },
            "required": ["generado_por", "advertencia"]
        }
    },
    "required": ["examen", "metadata"]
}

def generar_examen_ia(curso_prerrequisito, curso_destino, silabo):
    rigor = "Estricto" 
    puntaje_corte = 7
    tipo_curso = clasificar_curso_ia(silabo)
    matriz_texto = calcular_distribucion_bloom(tipo_curso, rigor, total_preguntas=10)
    
    prompt_usuario = f"""Genera el examen de prerrequisito.

CURSO PRERREQUISITO: {curso_prerrequisito}
CURSO DESTINO: {curso_destino}

CONFIGURACIÓN DE ESTE EXAMEN:
- Tipo de curso detectado: {tipo_curso}
- Rigor Institucional: {rigor}
- Puntaje de corte asignado: {puntaje_corte}/10

MATRIZ A CUMPLIR OBLIGATORIAMENTE (Suma 10 preguntas):
{matriz_texto}

------------------------
INICIO DEL SÍLABO
------------------------
{silabo}
------------------------
FIN DEL SÍLABO
------------------------"""

    respuesta = _generar_contenido(
        model=MODELO_SKILL,
        contents=prompt_usuario,
        config=types.GenerateContentConfig(
            system_instruction=SKILL1_PROMPT,
            temperature=0.3,
            response_mime_type="application/json",
            response_schema=SKILL1_SCHEMA,
        ),
    )
    return _extraer_json(respuesta.text)


# --- SKILL 2: CALIFICADOR DE EXÁMENES ---
SKILL2_PROMPT = """Eres un evaluador especialista en calificación de pruebas de competencias para adultos profesionales, que trabaja para la Escuela Nacional de Estadística e Informática (ENEI).

Tu única función es calificar exámenes de prerrequisito comparando dos fuentes de datos y devolver un veredicto en formato JSON estricto.

TU ROL

Recibirás dos objetos JSON en el mensaje del usuario:

1. El EXAMEN ORIGINAL (generado por el Skill 1): contiene las 10 preguntas, sus alternativas, la respuesta_correcta de cada una, el nivel_bloom de cada pregunta, y el puntaje_corte definido para ese examen.

2. Las RESPUESTAS DEL ALUMNO: contiene un alumno_id y un objeto con el id de cada pregunta (como string, ej. "1", "2") y la alternativa que el alumno marcó (A, B, C o D).

Debes cruzar ambos JSON pregunta por pregunta, determinar si cada respuesta del alumno coincide con la respuesta_correcta del examen original, calcular el puntaje total, y comparar ese puntaje contra el puntaje_corte del examen original para determinar el estado final.

REGLAS INQUEBRANTABLES

- Usa ÚNICAMENTE el puntaje_corte que viene dentro del JSON del examen original. Nunca asumas ni hardcodees un valor de corte propio.
- Cada pregunta correctamente respondida vale 1 punto. No hay puntajes parciales ni penalización por respuesta incorrecta.
- Si el alumno no respondió una pregunta (falta su id en el objeto de respuestas, o el valor es null, vacío, o no es A/B/C/D), cuenta esa pregunta como incorrecta. No la omitas del conteo.
- Compara las respuestas usando el id de la pregunta como string, sin asumir el orden de los objetos.
- El estado final es "APTO" si puntaje_obtenido >= puntaje_corte, y "NO APTO" si puntaje_obtenido < puntaje_corte. No uses otro criterio.
- Genera el detalle de las 10 preguntas, indicando para cada una: id, nivel_bloom (tómalo del examen original), respuesta_alumno, respuesta_correcta, y si fue correcta (true/false).
- Adicionalmente, agrega un resumen de desempeño por nivel_bloom: cuántas preguntas acertó el alumno en cada nivel (RECORDAR, COMPRENDER, APLICAR, ANALIZAR) sobre el total de preguntas de ese nivel en el examen. Esto sirve para detectar en qué nivel cognitivo específico falló el alumno, no solo el puntaje global.
- Si los dos JSON de entrada no calzan (por ejemplo, el examen original no tiene 10 preguntas, o falta el campo respuestas, o falta puntaje_corte), no inventes valores: indica el problema de forma breve en el campo "advertencia" de metadata y aun así devuelve la mejor calificación posible con los datos disponibles.
- Devuelve únicamente el objeto JSON, según el schema de salida configurado.
- No agregues explicaciones fuera del JSON.
- No uses Markdown.

CRITERIO ANTI-ALUCINACIÓN

No inventes respuestas correctas ni completes datos faltantes del examen original. Si un campo necesario no está presente en el input, refléjalo en la advertencia de metadata en lugar de asumir un valor.
"""

SKILL2_SCHEMA = {
    "type": "object",
    "properties": {
        "resultado": {
            "type": "object",
            "properties": {
                "alumno_id": {"type": "string"},
                "curso_prerrequisito": {"type": "string"},
                "curso_destino": {"type": "string"},
                "puntaje_obtenido": {"type": "integer"},
                "puntaje_corte": {"type": "integer"},
                "estado": {"type": "string", "enum": ["APTO", "NO APTO"]},
                "detalle_preguntas": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "nivel_bloom": {"type": "string", "enum": ["RECORDAR", "COMPRENDER", "APLICAR", "ANALIZAR", "EVALUAR"]},
                            "respuesta_alumno": {"type": "string"},
                            "respuesta_correcta": {"type": "string", "enum": ["A", "B", "C", "D"]},
                            "es_correcta": {"type": "boolean"}
                        },
                        "required": ["id", "nivel_bloom", "respuesta_alumno", "respuesta_correcta", "es_correcta"]
                    },
                    "minItems": 10,
                    "maxItems": 10
                },
                "resumen_por_nivel": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "nivel_bloom": {"type": "string", "enum": ["RECORDAR", "COMPRENDER", "APLICAR", "ANALIZAR", "EVALUAR"]},
                            "correctas": {"type": "integer"},
                            "total": {"type": "integer"}
                        },
                        "required": ["nivel_bloom", "correctas", "total"]
                    }
                }
            },
            "required": ["alumno_id", "curso_prerrequisito", "curso_destino", "puntaje_obtenido", "puntaje_corte", "estado", "detalle_preguntas", "resumen_por_nivel"]
        },
        "metadata": {
            "type": "object",
            "properties": {
                "generado_por": {"type": "string"},
                "advertencia": {"type": "string"}
            },
            "required": ["generado_por", "advertencia"]
        }
    },
    "required": ["resultado", "metadata"]
}

def calificar_examen_ia(examen_original, alumno_id, respuestas):
    payload = {
        "examen_original": examen_original,
        "respuestas_alumno": {
            "alumno_id": alumno_id,
            "respuestas": respuestas,
        },
    }
    try:
        respuesta = _generar_contenido(
            model=MODELO_SKILL,
            contents=json.dumps(payload, ensure_ascii=False),
            config=types.GenerateContentConfig(
                system_instruction=SKILL2_PROMPT,
                temperature=0,
                response_mime_type="application/json",
                response_schema=SKILL2_SCHEMA,
            ),
        )
        return _extraer_json(respuesta.text)
    except Exception as e:
        resultado = _calificar_local(examen_original, alumno_id, respuestas)
        resultado["metadata"]["advertencia"] = f"Skill 2 (IA) no disponible; se calificó localmente. Detalle: {e}"
        return resultado


def _calificar_local(examen_original, alumno_id, respuestas):
    """Respaldo determinístico que califica sin llamar a Gemini."""
    ex = examen_original.get("examen", examen_original)
    preguntas = ex.get("preguntas", [])
    puntaje_corte = ex.get("puntaje_corte", 7)
    detalle, correctas = [], 0
    niveles = {}
    
    for p in preguntas:
        pid = str(p.get("id"))
        nivel = p.get("nivel_bloom", "")
        marcada = respuestas.get(pid)
        if marcada not in ("A", "B", "C", "D"):
            marcada = "SIN RESPUESTA"
        es_correcta = (marcada == p.get("respuesta_correcta"))
        if es_correcta:
            correctas += 1
            
        acum = niveles.setdefault(nivel, {"correctas": 0, "total": 0})
        acum["total"] += 1
        if es_correcta:
            acum["correctas"] += 1
            
        detalle.append({
            "id": p.get("id"),
            "nivel_bloom": nivel,
            "respuesta_alumno": marcada,
            "respuesta_correcta": p.get("respuesta_correcta"),
            "es_correcta": es_correcta,
        })
        
    orden = ["RECORDAR", "COMPRENDER", "APLICAR", "ANALIZAR", "EVALUAR"]
    resumen = [
        {"nivel_bloom": n, "correctas": niveles[n]["correctas"], "total": niveles[n]["total"]}
        for n in orden if n in niveles
    ]
    
    return {
        "resultado": {
            "alumno_id": alumno_id,
            "curso_prerrequisito": ex.get("curso_prerrequisito", ""),
            "curso_destino": ex.get("curso_destino", ""),
            "puntaje_obtenido": correctas,
            "puntaje_corte": puntaje_corte,
            "estado": "APTO" if correctas >= puntaje_corte else "NO APTO",
            "detalle_preguntas": detalle,
            "resumen_por_nivel": resumen,
        },
        "metadata": {"generado_por": "Calificador local (respaldo sin IA)", "advertencia": ""},
    }


# ==========================================
#    ESQUEMAS DE PETICIÓN (Pydantic Models)
# ==========================================
class SolicitudExamen(BaseModel):
    curso_prerrequisito: str
    curso_destino: str
    silabo: str

class RespuestasAlumnoRequest(BaseModel):
    examen: dict
    respuestas_usuario: dict
    alumno_id: Optional[str] = "EST-001"