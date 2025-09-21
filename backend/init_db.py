from app import app, db

def init_database():
    """Initialize the database and create all tables"""
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")
        print("Tables created:")
        print("- Admin table for storing admin user information")

if __name__ == '__main__':
    init_database()
