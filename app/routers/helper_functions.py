from datetime import datetime, timedelta


def get_date_filter(option):
    today = datetime.utcnow()
    if option == "last_week":
        return today - timedelta(weeks=1)
    elif option == "last_month":
        return today - timedelta(days=30)  # Approximation for one month
    elif option == "last_6_months":
        return today - timedelta(days=180)
    elif option == "last_year":
        return today - timedelta(days=365)
    elif option == "all":
        return None  # No filter for "All"
    else:
        raise ValueError("Invalid filter option")
