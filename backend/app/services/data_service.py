import pandas as pd
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.sales import SalesRecord

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "real_sales.csv"


def load_real_dataset():
    df = pd.read_csv(DATA_FILE, parse_dates=["date"])

    # Already present in CSV
    df["date"] = df["date"].dt.date

    return df


def seed_database_if_empty(db: Session):
    if db.scalar(select(SalesRecord.id).limit(1)):
        return

    df = load_real_dataset()

    records = [
    SalesRecord(
        product_id=row.product_id,
        product_name=row.product_name,
        category=row.category,
        date=row.date,
        sales=row.sales,
        inventory=row.inventory,
        price=row.price,
    )
    for row in df.itertuples(index=False)
]

    db.bulk_save_objects(records)
    db.commit()


def get_sales_frame(db: Session, product_id=None):
    stmt = select(
        SalesRecord.product_id,
        SalesRecord.product_name,
        SalesRecord.category,
        SalesRecord.date,
        SalesRecord.sales,
        SalesRecord.inventory,
        SalesRecord.price,
    )

    if product_id:
        stmt = stmt.where(SalesRecord.product_id == product_id)

    rows = db.execute(stmt).all()

    # ✅ CREATE df FIRST
    df = pd.DataFrame(rows, columns=[
        "product_id",
        "product_name",
        "category",
        "date",
        "sales",
        "inventory",
        "price"
    ])

    if df.empty:
        return df

    df["date"] = pd.to_datetime(df["date"])

    return df.sort_values("date")