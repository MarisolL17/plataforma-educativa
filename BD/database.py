import os
import urllib.parse
import psycopg2
from psycopg2.extras import RealDictCursor
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Variables de entorno con valores por defecto seguros (no contienen contraseñas reales)
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
SCHEMA = os.getenv("DB_SCHEMA")

# 1. Conexión Directa mediante psycopg2 (para consultas SQL directas o rápidas)
def get_db_connection():
    """Retorna una conexión activa a PostgreSQL con cursor de tipo diccionario."""
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        cursor_factory=RealDictCursor
    )
    return conn

# 2. Configuración ORM con SQLAlchemy (para mapeo de tablas e inyección en FastAPI)
PASS_QUOTED = urllib.parse.quote_plus(DB_PASS)
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{PASS_QUOTED}@{DB_HOST}:{DB_PORT}/{DB_NAME}?client_encoding=utf8"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Generador de sesión ORM para inyección de dependencias en endpoints de FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()