import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_signup():
    print("Testing signup endpoint...")
    data = {
        "name": "Test Admin",
        "email": "test@example.com",
        "password": "testpass123",
        "department": "Electrical"
    }

    response = requests.post(f"{BASE_URL}/admin/signup", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_login():
    print("Testing login endpoint...")
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }

    response = requests.post(f"{BASE_URL}/admin/login", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_login_wrong_password():
    print("Testing login with wrong password...")
    data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }

    response = requests.post(f"{BASE_URL}/admin/login", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

if __name__ == "__main__":
    test_signup()
    test_login()
    test_login_wrong_password()
