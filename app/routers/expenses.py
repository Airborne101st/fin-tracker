from typing import List

from sqlalchemy import func, and_, desc

from app.schemas import CategoryBase, CategoryResponse, ExpenseCreate, ExpenseResponse, CategoryUpdate
from fastapi import APIRouter, Depends, Request
from app.database import get_db
from sqlalchemy.orm import Session
from app import models
from app.models import Expense, Category, User
from app.routers.helper_functions import get_date_filter
from fastapi import HTTPException

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


@router.put("/category/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, category_data: CategoryUpdate, db: Session = Depends(get_db)):
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category_data = category_data.dict(exclude_unset=True)

    for key, value in category_data.items():
        if value is not None:
            setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category




@router.get("/category/{user_id}", response_model=List[CategoryResponse])
async def get_category(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    categories = user.categories
    if categories:
        print("user categories ", user.categories)
        return categories


@router.get("/expense/{user_id}", response_model=List[ExpenseResponse])
async def get_expenses(user_id: int, db: Session = Depends(get_db)):
    """
    API to GET the list of expenses
    :param user_id:
    :param db:
    :return: expenses
    """
    expenses = db.query(Expense).filter(Expense.user_id == user_id).order_by(desc(Expense.create_date)).all()
    if expenses:
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


@router.get("/expense-summary/user/{user_id}/filter/{filter_option}")
async def get_expense_summary(user_id: int, filter_option: str, db: Session = Depends(get_db)):
    filter_date = get_date_filter(filter_option)
    if filter_date:
        summary = (
                        db.query(Category.name, func.sum(Expense.amount).label("total"))
                        .join(Expense, Expense.category_id == Category.id)
                        .filter(and_(Expense.user_id == user_id, Expense.create_date > filter_date))
                        .group_by(Category.name)
                        .all()
                    )

    else:
        summary = (
            db.query(Category.name, func.sum(Expense.amount).label("total"))
            .join(Expense, Expense.category_id == Category.id)
            .filter(Expense.user_id == user_id)
            .group_by(Category.name)
            .all()
        )

    return [{"category": name, "total": total} for name, total in summary]



