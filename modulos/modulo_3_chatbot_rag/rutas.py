from fastapi import APIRouter
from pydantic import BaseModel
from modulos.modulo_3_chatbot_rag.asistente import responder_consulta

router = APIRouter(
    prefix="/api/chatbot",
    tags=["Módulo 3 - Chatbot RAG"]
)

class ConsultaRequest(BaseModel):
    pregunta: str

@router.post("/consultar")
def consultar(req: ConsultaRequest):
    return responder_consulta(req.pregunta)