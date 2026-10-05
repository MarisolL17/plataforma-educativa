import os
import json
import time
import chromadb
from chromadb.utils import embedding_functions
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Cliente oficial de Google GenAI
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY_3"))

# Conexión con ChromaDB local
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Debe ser la misma función de embeddings con la que creaste e insertaste los datos
embed_fn = embedding_functions.DefaultEmbeddingFunction()

collection = chroma_client.get_or_create_collection(
    name="disenos_muestrales",
    embedding_function=embed_fn
)

def segundos_a_minutos(segundos: int) -> str:
    m, s = divmod(int(segundos), 60)
    return f"{m}:{s:02d}"

def responder_consulta(pregunta: str):
    # 1. Recuperar el fragmento más similar desde la base de datos
    resultados = collection.query(query_texts=[pregunta], n_results=1)

    # Validar que existan documentos devueltos
    if not resultados.get("documents") or not resultados["documents"][0]:
        return {
            "respuesta_chat": "No encontré un fragmento específico en las clases para responder a tu duda. ¿Deseas formular la pregunta de otra manera?",
            "video_id": "",
            "start_seconds": 0,
            "end_seconds": 0,
            "flashcard": {
                "titulo": "Sin coincidencias",
                "contenido": "No se encontraron registros en la base vectorial."
            }
        }

    fragmento = resultados["documents"][0][0]
    meta = resultados["metadatas"][0][0] if resultados.get("metadatas") else {}
    
    # Extraer metadatos de forma segura
    start_sec = meta.get("start", 0)
    end_sec = meta.get("end", 0)
    video_id = meta.get("video_id", "")
    
    label_inicio = segundos_a_minutos(start_sec)
    label_fin = segundos_a_minutos(end_sec)

    # Prompt con f-string adecuadamente escapado para JSON
    prompt = f"""
    Eres el 'Asistente ENEI' para el curso de Diseños Muestrales Básicos.
    Texto de la clase ({label_inicio} a {label_fin}):
    "{fragmento}"

    Pregunta del alumno: "{pregunta}"

    Responde en formato JSON estrictamente con esta estructura:
    {{
      "respuesta_chat": "Explicación directa al alumno. Incluye la frase: 'En el video lo explican con ejemplos entre los min {label_inicio} y {label_fin}. ¿Te muestro ese segmento?'",
      "video_id": "{video_id}",
      "start_seconds": {start_sec},
      "end_seconds": {end_sec},
      "flashcard": {{
        "titulo": "Concepto clave identificado",
        "contenido": "Definición concisa o fórmula breve para repasar"
      }}
    }}
    """

    # 2. Pool de modelos de Gemini actualizados y con estrategia de reintentos
    modelos_disponibles = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"]
    
    for modelo in modelos_disponibles:
        for intento in range(3): # Hasta 3 reintentos por modelo
            try:
                res = client.models.generate_content(
                    model=modelo,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.2
                    )
                )
                return json.loads(res.text)
            except Exception as e:
                error_str = str(e).upper()
                print(f"[Aviso Gemini] Error en modelo '{modelo}' (intento {intento+1}): {e}")
                
                # Si es un error de saturación temporal (503 / UNAVAILABLE / OVERLOADED)
                if any(k in error_str for k in ["503", "UNAVAILABLE", "OVERLOADED"]):
                    time.sleep(2 * (intento + 1))
                    continue
                # Si el modelo no existe o falla por otra razón, probar con el siguiente modelo del pool
                break

    # Fallback si toda la infraestructura está saturada
    return {
        "respuesta_chat": f"El servicio de IA se encuentra saturado en este momento. Este concepto se desarrolla entre los min {label_inicio} y {label_fin}. ¿Te muestro ese segmento?",
        "video_id": video_id,
        "start_seconds": start_sec,
        "end_seconds": end_sec,
        "flashcard": {
            "titulo": "Ubicación en el video",
            "contenido": f"Revisa la explicación en el minuto {label_inicio}."
        }
    }