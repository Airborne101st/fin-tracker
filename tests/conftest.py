import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.utils import create_test_user
from app.database import get_db
from tests.test_database import create_test_database, drop_test_database

@pytest.fixture(scope="module")
def test_db():
    # Create the database
    engine, TestSessionLocal = create_test_database()
    db_session = TestSessionLocal()
    create_test_user(db_session)
    yield TestSessionLocal
    # Drop the database
    drop_test_database(engine)

@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        db = test_db()  # Create session from the sessionmaker
        try:
            yield db
        finally:
            db.close()  # Close the session after use

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
