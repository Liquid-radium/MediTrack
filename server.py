from flask import Flask, jsonify, request, render_template, send_file, session, redirect, url_for
import os
from dotenv import load_dotenv
import io
import qrcode
try:
    # Prefer lazy/safe import to avoid startup failures if package missing
    from supabase import create_client as _create_client
except Exception:  # pragma: no cover - environment-specific
    _create_client = None
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from datetime import timedelta
from functools import wraps

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# --- App configuration & sessions ---
secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    # Ephemeral fallback for development. In production, require SECRET_KEY.
    secret_key = secrets.token_hex(32)
app.secret_key = secret_key

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=(os.environ.get("FLASK_ENV", "development").lower() == "production"),
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
)


# --- Supabase setup (lazy) ---
# Lazily initialize the Supabase client so that pages like login/signup can
# render even when environment variables are missing in development.
_supabase_client = None

def get_supabase():
    """Return a cached Supabase client or None if not configured."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        return None
    try:
        if _create_client is None:
            return None
        _supabase_client = _create_client(url, key)
        return _supabase_client
    except Exception:
        # If initialization fails, leave client as None and let routes handle it
        return None




# --- Helpers ---

def login_required(view_func):
    @wraps(view_func)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            wants_json = (
                (request.accept_mimetypes.best or "").lower() == "application/json"
                or request.is_json
                or request.path.endswith(".json")
            )
            if wants_json:
                return jsonify({"error": "Authentication required"}), 401
            return redirect(url_for("login", next=request.url))
        return view_func(*args, **kwargs)
    return wrapped


# --- Auth Routes ---

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")

    username = request.form.get("username", "").strip()
    email = request.form.get("email", "").strip()
    password = request.form.get("password", "")

    client = get_supabase()
    if client is None:
        return render_template("signup.html", error="Server not configured: missing Supabase credentials."), 500

    if not username or not email or not password:
        return render_template("signup.html", error="All fields are required."), 400

    # Ensure username is unique
    existing = client.table("users").select("id").eq("username", username).execute()
    if existing.data:
        return render_template("signup.html", error="Username already exists."), 400

    password_hash = generate_password_hash(password)
    created = client.table("users").insert({
        "username": username,
        "email": email,
        "password": password_hash,
    }).execute()

    if not created.data:
        return render_template("signup.html", error="Failed to create user. Try again."), 500

    user_row = created.data[0]
    session.permanent = True
    session["user_id"] = user_row.get("id")
    session["username"] = username
    return redirect(url_for("home"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")

    username = request.form.get("username", "").strip()
    password = request.form.get("password", "")

    client = get_supabase()
    if client is None:
        return render_template("login.html", error="Server not configured: missing Supabase credentials."), 500

    if not username or not password:
        return render_template("login.html", error="Username and password are required."), 400

    result = client.table("users").select("id, username, password").eq("username", username).limit(1).execute()
    if not result.data:
        return render_template("login.html", error="Invalid username or password."), 401

    user_row = result.data[0]
    if not check_password_hash(user_row.get("password", ""), password):
        return render_template("login.html", error="Invalid username or password."), 401

    session.permanent = True
    session["user_id"] = user_row.get("id")
    session["username"] = user_row.get("username")
    next_url = request.args.get("next")
    return redirect(next_url or url_for("home"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# --- Routes ---

@app.route("/")
@login_required
def home():
    return render_template("index.html", username=session.get("username"))


@app.route("/admin", methods=["GET", "POST"])
@login_required
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
@login_required
def get_patient(patient_id):
    try:
        client = get_supabase()
        if client is None:
            return jsonify({"error": "Server not configured: missing Supabase credentials."}), 500
        response = client.table("patient").select("*").eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify(response.data[0])
        return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_patient", methods=["POST"])
@login_required
def add_patient():
    """
    Adds a new patient to the database using data from the POST request.
    """
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    age = data.get("age")
    ward = data.get("ward")

    if not name or age is None or ward is None:
        return jsonify({"error": "name, age, and ward are required"}), 400

    try:
        client = get_supabase()
        if client is None:
            return jsonify({"error": "Server not configured: missing Supabase credentials."}), 500
        response = client.table("patient").insert({
            "name": name,
            "age": age,
            "ward": ward,
        }).execute()
        if response.data:
            return jsonify({"message": "Patient added successfully", "patient": response.data[0]}), 201
        return jsonify({"error": "Insert failed"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/edit_patient_form")
@login_required
def edit_patient_form():
    return render_template("edit_patient.html")

@app.route("/qr_page")
@login_required
def qr_page():
    return render_template("qr_page.html")

@app.route("/patients", methods=["GET"])
@login_required
def get_all_patients():
    client = get_supabase()
    if client is None:
        return jsonify({"error": "Server not configured: missing Supabase credentials."}), 500
    response = client.table("patient").select("*").execute()
    if response.data:
        return jsonify(response.data)
    return jsonify({"error": "No patients found"}), 404

@app.route("/delete_patient/<int:patient_id>", methods=["DELETE"])
@login_required
def delete_patient(patient_id):
    try:
        client = get_supabase()
        if client is None:
            return jsonify({"error": "Server not configured: missing Supabase credentials."}), 500
        response = client.table("patient").delete().eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify({"message": f"Patient {patient_id} discharged successfully!"})
        else:
            return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/edit_patient/<int:patient_id>", methods=["PUT"])
@login_required
def edit_patient(patient_id):
    update_data = request.get_json(silent=True) or {}
    if not update_data:
        return jsonify({"error": "No update fields provided"}), 400
    try:
        client = get_supabase()
        if client is None:
            return jsonify({"error": "Server not configured: missing Supabase credentials."}), 500
        response = client.table("patient").update(update_data).eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify({"message": "Patient updated successfully", "patient": response.data[0]})
        else:
            return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_vitals/<int:patient_id>", methods=["GET"])
@login_required
def get_vitals(patient_id):
    try:
        # Fetch latest vitals for this patient
        client = get_supabase()
        if client is None:
            return jsonify({"error": "Server not configured: missing Supabase credentials."}), 500
        response = client.table("vitals").select("*").eq("patient_id", patient_id).order("timestamp", desc=True).limit(1).execute()

        if response.data:
            return jsonify(response.data[0])   # send the latest record
        else:
            return jsonify({"error": "No vitals found for this patient"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/patient/<int:patient_id>/vitals", methods=["GET"])
@login_required
def get_patient_vitals(patient_id):
    return get_vitals(patient_id)
    
@app.before_request
def enforce_https():
    # Skip HTTPS enforcement if running locally or in development
    env = os.environ.get("FLASK_ENV", "development").lower()
    host = request.host.split(":")[0]
    if env != "production" or host in ["127.0.0.1", "localhost"]:
        return
    if not request.is_secure:
        url = request.url.replace("http://", "https://", 1)
        return redirect(url, code=301)

    
# Route consolidated above to use int converter and unified error handling.


# --- Run the app ---
if __name__ == "__main__":
    debug = (os.environ.get("FLASK_ENV") != "production")
    app.run(debug=debug, host="0.0.0.0", port=5000)