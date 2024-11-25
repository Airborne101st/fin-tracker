from fastapi import APIRouter, Depends, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.schemas import Token, UserCreate
from app.models import User
from app.database import get_db
from app.auth import get_password_hash, create_access_token, verify_password

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "pong"}


@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    print("HIT")

    hashed_password = get_password_hash(user.hashed_password)
    db_user = User(full_name=user.full_name, username=user.username,
                   hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.id}


@router.post("/login", response_model=Token)
def post_login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.hashed_password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.username})
    if access_token:
        print("user_id", db_user.id)
        return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.id}
