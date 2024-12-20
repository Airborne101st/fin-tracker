from typing import List

from sqlalchemy import func

from app.schemas import CategoryBase, CategoryResponse, ExpenseCreate, ExpenseResponse
from fastapi import APIRouter, Depends, Request
from app.database import get_db
from sqlalchemy.orm import Session
from app import models
from app.models import Expense, Category, User

router = APIRouter()


@router.post("/category", response_model=CategoryResponse)
async def add_category(category: CategoryBase, db: Session = Depends(get_db)):
    new_category = models.Category(name=category.name, monthly_target=category.monthly_target, unit=category.unit,
                                   user_id=category.user_id)
    try:
        db.add(new_category)
        db.commit()
    except Exception as exc:
        print("ERROR ", exc)
    return new_category


@router.get("/category/{user_id}", response_model=List[CategoryResponse])
async def get_category(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    categories = user.categories
    if categories:
        print("user categories ", user.categories)
        return categories


@router.get("/expense/{user_id}", response_model=List[ExpenseResponse])
async def get_expenses(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    expenses = user.expenses
    if expenses:
        print("User Expenses ", user.expenses)
        return expenses


@router.post("/add-expense", response_model=ExpenseResponse)
async def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = models.Expense(amount=expense.amount, description=expense.description,
                                 category_id=expense.category_id,
                                 user_id=expense.user_id)

    try:
        db.add(new_expense)
        db.commit()
        print("BIGGG", new_expense.id)
    except Exception as exc:
        print("ERROR ", exc)
    return new_expense


@router.get("/expense-summary/user/{user_id}")
async def get_expense_summary(user_id: int, db: Session = Depends(get_db)):
    summary = (
                    db.query(Category.name, func.sum(Expense.amount).label("total"))
                    .join(Expense, Expense.category_id == Category.id)
                    .filter(Expense.user_id == user_id)
                    .group_by(Category.name)
                    .all()
                )

    return [{"category": name, "total": total} for name, total in summary]



