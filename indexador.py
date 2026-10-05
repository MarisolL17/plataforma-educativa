import json
import os
import chromadb
from chromadb.utils import embedding_functions

def indexar_archivo(archivo_json: str, video_id: str, segundos_bloque=120):
    if not os.path.exists(archivo_json):
        print(f"No existe el archivo {archivo_json}")
        return

    with open(archivo_json, "r", encoding="utf-8") as f:
        subtitulos = json.load(f)

    # Conectar a ChromaDB local
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    embed_fn = embedding_functions.DefaultEmbeddingFunction()
    collection = chroma_client.get_or_create_collection(
        name="disenos_muestrales",
        embedding_function=embed_fn
    )

    chunks = []
    bloque_texto = []
    inicio_bloque = subtitulos[0]["start"]

    for sub in subtitulos:
        bloque_texto.append(sub["text"])
        tiempo_actual = sub["start"] + sub.get("duration", 0)

        if (tiempo_actual - inicio_bloque) >= segundos_bloque:
            chunks.append({
                "texto": " ".join(bloque_texto),
                "start": int(inicio_bloque),
                "end": int(tiempo_actual)
            })
            bloque_texto = []
            inicio_bloque = tiempo_actual

    if bloque_texto:
        chunks.append({
            "texto": " ".join(bloque_texto),
            "start": int(inicio_bloque),
            "end": int(subtitulos[-1]["start"] + subtitulos[-1].get("duration", 0))
        })

    # Guardar en ChromaDB
    for i, c in enumerate(chunks):
        collection.upsert(
            ids=[f"{video_id}_{i}"],
            documents=[c["texto"]],
            metadatas=[{
                "video_id": video_id,
                "start": c["start"],
                "end": c["end"]
            }]
        )

    print(f"Indexados {len(chunks)} fragmentos para el video {video_id}.")

if __name__ == "__main__":
    ID_CLASE_1 = "3VsBQkDm_4o"
    ruta_json = os.path.join("data", "raw", "clase_01.json")
    indexar_archivo(ruta_json, ID_CLASE_1)