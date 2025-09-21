from app import app, db
from models import Admin

def test_database():
    with app.app_context():
        # Query all admins
        admins = Admin.query.all()
        print(f"Total admins in database: {len(admins)}")

        if admins:
            for admin in admins:
                print(f"Admin: {admin.name} - {admin.email} - {admin.department}")
        else:
            print("No admins found in database")

if __name__ == "__main__":
    test_database()
