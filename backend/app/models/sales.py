from sqlalchemy import Date, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SalesRecord(Base):
    __tablename__ = "sales_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    product_id: Mapped[str] = mapped_column(String(64), index=True)
    product_name: Mapped[str] = mapped_column(String(128))
    category: Mapped[str] = mapped_column(String(64))

    date: Mapped[Date] = mapped_column(Date, index=True)
    sales: Mapped[float] = mapped_column(Float)
    inventory: Mapped[float] = mapped_column(Float)
    price: Mapped[float] = mapped_column(Float)
