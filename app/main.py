from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import users, expenses
from app.database import Base, engine
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()

print("ENV", os.environ.get('DATABASE_URL'))

origins = [
    os.environ.get('FRONTEND_SERVICE')
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Allows listed origins
    allow_credentials=True,              # Allows cookies to be sent
    allow_methods=["*"],                 # Allows all HTTP methods
    allow_headers=["*"],                 # Allows all headers
)

app.include_router(users.router, prefix="/auth", tags=["auth"])
app.include_router(expenses.router, prefix="/expenses", tags=["expenses"])