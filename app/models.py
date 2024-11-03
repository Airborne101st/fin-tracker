from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    full_name = Column(String)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    categories = relationship("Category", back_populates="user")
    expenses = relationship("Expense", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    monthly_target = Column(Integer)
    unit = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="categories")
    expenses = relationship('Expense', back_populates="category")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    amount = Column(Integer)
    description = Column(String)
    create_date = Column(DateTime, default=datetime.now())
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")



