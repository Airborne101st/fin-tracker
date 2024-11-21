from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    full_name: str | None = None
    username: str

class UserCreate(UserBase):
    hashed_password: str

class UserResponse(UserBase):
    id: int
    categories: Optional[List["CategoryResponse"]] = []
    expenses: Optional[List["ExpenseResponse"]] = []

    class Config:
        orm_mode = True


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    monthly_target: int
    unit: str
    user_id: int

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    user_id: int
    expenses: Optional[List["ExpenseResponse"]] = []

    class Config:
        orm_mode = True


# Expense Schemas
class ExpenseBase(BaseModel):
    amount: int
    description: str
    create_date: Optional[datetime] = datetime.now()

class ExpenseCreate(ExpenseBase):
    category_id: int
    user_id: int

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    category: CategoryBase

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
