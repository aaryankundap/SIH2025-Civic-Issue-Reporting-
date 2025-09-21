
from flask import Flask, jsonify, request
from flask_cors import CORS
import os, tempfile
from analyze_image_wrapper import analyze_image_file
from models import db, Admin

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///admin.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

OUTPUT_JSON_PATH = os.path.join(os.path.dirname(__file__), "output.json")

@app.route("/api/issue", methods=["GET"])
def get_issue():
    if os.path.exists(OUTPUT_JSON_PATH):
        with open(OUTPUT_JSON_PATH, "r", encoding="utf-8") as f:
            data = f.read()
        return app.response_class(response=data, status=200, mimetype='application/json')
    else:
        return jsonify({"message":"no output yet", "data": None}), 200

@app.route("/api/analyze", methods=["POST"])
def analyze_upload():
    if "file" not in request.files:
        return jsonify({"error":"No file provided"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error":"Empty filename"}), 400
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name
    try:
        result = analyze_image_file(tmp_path)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        try:
            os.remove(tmp_path)
        except:
            pass

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['email', 'password']
        for field in required_fields:
            if not data or field not in data or not data[field].strip():
                return jsonify({
                    "success": False,
                    "message": f"Missing or empty field: {field}"
                }), 400

        email = data['email'].strip()
        password = data['password'].strip()

        # Validate email format
        if '@' not in email:
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address"
            }), 400

        # Validate password length
        if len(password) < 6:
            return jsonify({
                "success": False,
                "message": "Password must be at least 6 characters long"
            }), 400

        # Check if admin exists
        existing_admin = Admin.query.filter_by(email=email).first()
        if not existing_admin:
            return jsonify({
                "success": False,
                "message": "No account found with this email address. Please sign up first."
            }), 404

        # Check password
        if not existing_admin.check_password(password):
            return jsonify({
                "success": False,
                "message": "Invalid password. Please try again."
            }), 401

        return jsonify({
            "success": True,
            "message": f"Welcome back {existing_admin.name}!",
            "admin": existing_admin.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

@app.route("/api/admin/signup", methods=["POST"])
def admin_signup():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'email', 'password', 'department']
        for field in required_fields:
            if not data or field not in data or not data[field].strip():
                return jsonify({
                    "success": False,
                    "message": f"Missing or empty field: {field}"
                }), 400

        name = data['name'].strip()
        email = data['email'].strip()
        password = data['password'].strip()
        department = data['department'].strip()

        # Validate email format
        if '@' not in email:
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address"
            }), 400

        # Validate password length
        if len(password) < 6:
            return jsonify({
                "success": False,
                "message": "Password must be at least 6 characters long"
            }), 400

        # Check if admin already exists
        existing_admin = Admin.query.filter_by(email=email).first()
        if existing_admin:
            return jsonify({
                "success": False,
                "message": "An admin with this email already exists. Please use login instead."
            }), 409

        # Create new admin
        new_admin = Admin(name=name, email=email, password=password, department=department)

        # Save to database
        db.session.add(new_admin)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"Welcome {name}! Admin account created successfully.",
            "admin": new_admin.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
