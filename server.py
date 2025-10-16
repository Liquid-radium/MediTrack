from flask import Flask, jsonify, request, render_template, send_file, session, redirect, url_for
import os
from dotenv import load_dotenv
import io
import qrcode
from supabase import create_client
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from datetime import timedelta

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY", "supersecretkey")
# Using Flask's built-in secure cookie session by default.
# If you require server-side sessions, install Flask-Session in your environment:
#   pip install Flask-Session
# and restore the following lines:
# from flask_session import Session
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)
# generate_password_hash and check_password_hash are used directly
# Secure SECRET_KEY handling
_env_key = os.getenv("SECRET_KEY")

if not _env_key or _env_key == "supersecretkey":
    # In production we require an explicit SECRET_KEY
    if os.environ.get("FLASK_ENV") == "production":
        raise RuntimeError(
            "SECRET_KEY must be set in environment for production. "
            "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
        )
    # For development only: use an ephemeral key (won't persist across restarts)
    app.logger.warning("No SECRET_KEY set; using ephemeral key for development.")
    app.secret_key = secrets.token_urlsafe(64)
else:
    app.secret_key = _env_key

# Harden cookie/session settings
app.config.update(
    SESSION_COOKIE_SECURE=(os.environ.get("FLASK_ENV") == "production"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
)

# Optional: if you want server-side sessions, uncomment and configure Flask-Session:
# from flask_session import Session
# app.config["SESSION_TYPE"] = "filesystem"  # or "redis" in production
# Session(app)
# --- Supabase setup ---
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
if not url or not key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment")
supabase = create_client(url, key)

# ===============================
#         AUTH ROUTES
# ===============================

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.form
        username = data.get("username")
        password = data.get("password")

        # Fetch user
        result = supabase.table("users").select("*").eq("username", username).execute()
        if not result.data:
            return render_template("login.html", error="User not found")
        user = result.data[0]
        if check_password_hash(user["password"], password):
            session["user_id"] = user["id"]
        if check_password_hash(user["password"], password):
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            return redirect(url_for("home"))
        else:
            return render_template("login.html", error="Invalid password")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        data = request.form
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not username or not password or not email:
            return render_template("signup.html", error="Missing required fields")

        hashed_pw = generate_password_hash(password)

        # Check existing user
        existing = supabase.table("users").select("*").eq("username", username).execute()
        if existing.data:
            return render_template("signup.html", error="Username already exists")

        response = supabase.table("users").insert({
            "username": username,
            "password": hashed_pw,
            "email": email
        }).execute()

        if response.data:
            return redirect(url_for("login"))
        else:
            return render_template("signup.html", error="Signup failed")

    return render_template("signup.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# --- Routes ---

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/admin", methods=["GET", "POST"])
def admin():
    qr_image = None
    if request.method == "POST":
        patient_id = request.form.get("patient_id")
        if patient_id:
            # Generate QR code for the patient
            base_url = request.host_url + "patient/"
            full_url = f"{base_url}{patient_id}"
            img = qrcode.make(full_url)

            # Convert image to bytes to send without saving
            img_io = io.BytesIO()
            img.save(img_io, "PNG")
            img_io.seek(0)
            return send_file(img_io, mimetype="image/png", as_attachment=True,
                             download_name=f"patient_{patient_id}.png")
    return render_template("admin.html")


@app.route("/patient/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    try:
        response = supabase.table("patient").select("*").eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify(response.data[0])
        return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
def add_patient():
    data = request.json
    name = data.get("name")
@app.route("/patient", methods=["POST"])
def add_patient():
    data = request.json
    name = data.get("name")
    age = data.get("age")
    ward = data.get("ward")

    if not name or not age:
        return jsonify({"error": "Missing required fields"}), 400

    response = supabase.table("patient").insert({
        "name": name,
        "age": age,
        "ward": ward
    }).execute()

    if response.data:
        return jsonify({"message": "Patient added successfully", "patient": response.data[0]}), 201
    return jsonify({"error": "Insert failed"}), 500
def edit_patient(pid):
    data = request.json
    update_data = {}

    if "name" in data:
        update_data["name"] = data["name"]
    if "age" in data:
        update_data["age"] = data["age"]
    if "ward" in data:
        update_data["ward"] = data["ward"]

    if not update_data:
        return jsonify({"error": "No fields to update"}), 400

    response = supabase.table("patient").update(update_data).eq("patient_id", pid).execute()

    if response.data:
        return jsonify({"message": "Patient updated successfully", "patient": response.data[0]})
    return jsonify({"error": "Update failed or patient not found"}), 404

@app.route("/add_patient_form")
def add_patient_form():
    return render_template("add_patient.html")

@app.route("/edit_patient_form")
def edit_patient_form():
    return render_template("edit_patient.html")

@app.route("/qr_page")
def qr_page():
    return render_template("qr_page.html")

@app.route("/patients", methods=["GET"])
def get_all_patients():
    response = supabase.table("patient").select("*").execute()
    if response.data:
        return jsonify(response.data)
    return jsonify({"error": "No patients found"}), 404

@app.route("/delete_patient/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    try:
        response = supabase.table("patient").delete().eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify({"message": f"Patient {patient_id} discharged successfully!"})
        else:
            return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_vitals/<int:patient_id>", methods=["GET"])
def get_vitals(patient_id):
    try:
        # Fetch latest vitals for this patient
        response = supabase.table("vitals").select("*").eq("patient_id", patient_id).order("timestamp", desc=True).limit(1).execute()

        if response.data:
            return jsonify(response.data[0])   # send the latest record
        else:
            return jsonify({"error": "No vitals found for this patient"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.before_request
def enforce_https():
    if not request.is_secure and os.environ.get("FLASK_ENV") == "production":
        url = request.url.replace("http://", "https://", 1)
        return redirect(url, code=301)
    
# Route consolidated above to use int converter and unified error handling.


# --- Run the app ---
if __name__ == "__main__":
    debug = (os.environ.get("FLASK_ENV") != "production")
    app.run(debug=debug, host="0.0.0.0", port=5000)