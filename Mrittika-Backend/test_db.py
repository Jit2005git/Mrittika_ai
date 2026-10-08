from app.database import engine, Base
from app.models.farmer import Farmer

try:
    Base.metadata.create_all(bind=engine)

    print("✅ Database connection successful!")
    print("✅ Farmers table created successfully!")

except Exception as e:
    print("❌ Database setup failed!")
    print(e)