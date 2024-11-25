import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base

load_dotenv()

TEST_DATABASE_URL = os.environ.get('TEST_DATABASE_URL')


# Create an engine and sessionmaker for the test database
def create_test_database():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, TestSessionLocal

# Drop the test database
def drop_test_database(engine):
    Base.metadata.drop_all(bind=engine)
    print("Tables dropped successfully!")
