from sqlalchemy.orm import Session

from app.database import Base, engine
from app.services.data_service import ensure_sample_dataset, seed_database_if_empty


def main() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_sample_dataset()
    with Session(engine) as db:
        seed_database_if_empty(db)
    print("Synthetic data generated and database seeded.")


if __name__ == "__main__":
    main()
