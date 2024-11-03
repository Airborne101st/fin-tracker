from fastapi import FastAPI
from app.routers import users
from app.database import Base, engine
from dotenv import load_dotenv
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()

print("ENV", os.environ.get('DATABASE_URL'))

app.include_router(users.router, prefix="/auth", tags=["auth"])