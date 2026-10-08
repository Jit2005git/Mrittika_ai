from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

engine = None

if DATABASE_URL:
    try:
        connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
        test_engine = create_engine(
            DATABASE_URL,
            connect_args=connect_args
        )
        with test_engine.connect():
            pass
        engine = test_engine
    except Exception:
        engine = None

if engine is None:
    DATABASE_URL = "sqlite:///./mrittika.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()