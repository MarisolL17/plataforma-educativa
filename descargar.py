import json
import os
from youtube_transcript_api import YouTubeTranscriptApi

def descargar_transcripcion(video_id: str, nombre_archivo: str):
    ruta_destino = os.path.join("data", "raw", f"{nombre_archivo}.json")
    os.makedirs(os.path.dirname(ruta_destino), exist_ok=True)
    
    print(f"Descargando subtítulos del video: {video_id}...")
    try:
        # En la versión moderna se crea una instancia de la API
        ytt_api = YouTubeTranscriptApi()
        
        # Descarga la transcripción en español (o la traduce/busca si está disponible)
        transcript_obj = ytt_api.fetch(video_id, languages=['es'])
        
        # Convierte el objeto a lista estándar de diccionarios [{'text': ..., 'start': ..., 'duration': ...}]
        subtitulos = transcript_obj.to_raw_data()

        with open(ruta_destino, "w", encoding="utf-8") as f:
            json.dump(subtitulos, f, ensure_ascii=False, indent=2)

        print(f"Guardado exitosamente en: {ruta_destino}")
        return ruta_destino

    except Exception as e:
        print(f"Error al descargar la transcripción: {e}")
        return None

if __name__ == "__main__":
    ID_CLASE_1 = "3VsBQkDm_4o"
    descargar_transcripcion(ID_CLASE_1, "clase_01")