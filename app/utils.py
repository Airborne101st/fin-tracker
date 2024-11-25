from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_test_user(db_session, username="donalduck", password="duckpass", full_name="Donald Duck"):
    hashed_password = pwd_context.hash(password)
    user = User(username=username, hashed_password=hashed_password, full_name=full_name)
    db_session.add(user)
    db_session.commit()
    return user
