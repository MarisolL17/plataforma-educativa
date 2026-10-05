#py -m uvicorn main_enei:app --reload --> Para encender el servidor
#py -m uvicorn main_enei:app --reload --host 0.0.0.0 --port 8000

import psycopg2

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Importamos para el registro
from registro.main_registro import router as router_autenticacion

# Importamos el router del Módulo 2
from modulos.modulo_2_evaluaciones.rutas import router as router_evaluaciones
from modulos.modulo_2_evaluaciones.evaluador import get_db_connection
from modulos.modulo_3_chatbot_rag.rutas import router as router_chatbot

app = FastAPI(
    title="API Sistema de Evaluación ENEI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Registrar el Router del Módulo 2 (incluye /generar-examen, /calificar-examen y /cursos)
app.include_router(router_evaluaciones)
app.include_router(router_autenticacion)
app.include_router(router_chatbot)

# 2. Endpoints Globales / Generales del Servidor
@app.get("/")
def inicio():
    return {"mensaje": "La API de ENEI está funcionando correctamente."}

@app.get("/api/programas")
def listar_programas():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = """
        SELECT codigo, tipo, titulo, descripcion, objetivo_general, objetivos_especificos, contenido_tematico, duracion, prerequisitos, resultados_esperados
        FROM enei.programas;
        """
        cur.execute(query)
        programas = cur.fetchall()
        cur.close()
        conn.close()
        return {"status": "success", "data": programas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los programas: {str(e)}")

@app.get("/api/programas/{codigo}")
def obtener_programa_detalle(codigo: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SET search_path TO enei, public;")
        
        query_programa = "SELECT * FROM enei.programas WHERE codigo::text = %s;"
        cur.execute(query_programa, (str(codigo),))
        programa = cur.fetchone()
        
        if not programa:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail=f"Programa con código {codigo} no encontrado.")
            
        query_plan = """
        SELECT p.id_curso, c.nombre_curso, p.horas
        FROM enei.plan_de_estudios p
        INNER JOIN enei.cursos c ON p.id_curso::text = c.id_curso::text
        WHERE p.codigo::text = %s;
        """
        cur.execute(query_plan, (str(codigo),))
        plan_de_estudios = cur.fetchall()
        
        cur.close()
        conn.close()
        
        programa = dict(programa)
        programa["plan_de_estudios"] = [dict(row) for row in plan_de_estudios]
        return {"status": "success", "data": programa}
    except Exception as e:
        print(f"❌ Error en /api/programas/{codigo}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

    
# ... (aquí pueden ir routers de otros módulos) ...