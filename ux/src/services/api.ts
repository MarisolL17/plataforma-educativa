// src/services/api.ts

// Dirección de tu servidor FastAPI
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface AsignaturaPlan{
    nombre_curso: string;
    horas: number;
}

export interface Programa {
    codigo: string;
    tipo: string;
    titulo: string;
    descripcion: string;
    objetivo_general: string;
    objetivos_especificos?: string;
    contenido_tematico?: string;
    plan_de_estudios?: AsignaturaPlan[];
    duracion?: string;
    prerequisitos?: string;
    resultados_esperados?: string;
}


export async function obtenerProgramas(): Promise<Programa[]> {
  const response = await fetch(`${API_URL}/programas`);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de programas");
    }
    const data = await response.json();
    return data.data || [];
}

export async function obtenerProgramaPorCodigo(codigo: string): Promise<Programa> {
    const response = await fetch(`${API_URL}/programas/${codigo}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el programa con código ${codigo}`);
    }
    const data = await response.json();
    return data.data;
}

// 2. Solicitar la generación de examen con Gemini
export async function generarExamen(cursoPrereq: string, cursoDestino: string, silabo: string) {
  const response = await fetch(`${API_URL}/generar-examen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      curso_prerrequisito: cursoPrereq,
      curso_destino: cursoDestino,
      silabo: silabo,
    }),
  });
  if (!response.ok) {
    throw new Error("Error al generar el examen");
  }
  const data = await response.json();
  return data.examen;
}

// 3. Calificar las respuestas del alumno
export async function calificarExamen(examenOriginal: any,
    respuestasUsuario: Record<string, string>,
    alumnoId: string = "EST-001"
) {
    const payload = {
        examen: examenOriginal,
        respuestas_usuario: respuestasUsuario,
        alumno_id: alumnoId, // Asegúrate de definir alumnoId en tu contexto o pasarlo como argumento
    };
    const response = await fetch(`${API_URL}/calificar-examen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al calificar el examen");
  }
  const data = await response.json();
  return data; // Devuelve el resultado de la calificación
}

export async function loginUsuario(correo: string, password: string) {
  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });

  // Si FastAPI responde 400, 401 o 404, lanzamos un error y DETENEMOS el flujo
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Credenciales incorrectas");
  }

  return await response.json(); // Retorna el token o datos del usuario si fue exitoso
}

// En src/services/api.ts
export async function registrarUsuario(payload: any) {
  const response = await fetch(`${API_URL}/v1/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al registrar el usuario");
  }
  return data;
}