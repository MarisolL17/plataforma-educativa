import os
import json
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Importar el esquema Pydantic consolidado ya existente en tu módulo de registro
from registro.schemas import CompletarPerfilSchema

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
MODELO_GEMINI = os.getenv("MODELO_IA_GEMINI")

def extraer_datos_cv_bytes(pdf_bytes: bytes) -> dict:
    """
    Recibe los bytes del PDF subido desde el botón de la plataforma
    y devuelve el JSON estructurado según CompletarPerfilSchema.
    """
    if not API_KEY:
        raise ValueError("No se encontró la variable de entorno GOOGLE_API_KEY")

    client = genai.Client(api_key=API_KEY)

    prompt = (
        "Analiza minuciosamente el archivo PDF adjunto (Currículum Vitae) "
        "y extrae toda la información relevante completando estrictamente la estructura solicitada.\n"
        "- Si un campo no está presente en el CV, asigna una cadena vacía '' o una lista vacía [].\n"
        "- En 'habilidades', resume las herramientas y software clave separados por coma."
    )

    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=CompletarPerfilSchema,  # Schema importado de schemas.py
        temperature=0.1
    )

    # Reintentos automáticos ante picos de demanda (Error 503 / UNAVAILABLE)
    max_reintentos = 4
    for intento in range(max_reintentos):
        try:
            response = client.models.generate_content(
                model=MODELO_GEMINI,
                contents=[
                    types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
                    prompt
                ],
                config=config
            )
            return json.loads(response.text)

        except Exception as e:
            error_str = str(e).upper()
            if ("503" in error_str or "UNAVAILABLE" in error_str or "OVERLOADED" in error_str) and intento < max_reintentos - 1:
                tiempo_espera = (intento + 1) * 3
                print(f"⚠️ Servidor ocupado (503). Reintentando en {tiempo_espera}s... (Intento {intento + 1}/{max_reintentos})")
                time.sleep(tiempo_espera)
            else:
                raise e