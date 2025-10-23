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


# --- Supabase setup ---
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
if not url or not key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment")
supabase = create_client(url, key)




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
    return jsonify({"error": "Insert failed"}), 500
@app.route("/patient", methods=["POST"])
def add_patient():
    """
    Adds a new patient to the database using data from the POST request.
    """
    data = request.json
    name = data.get("name")
    age = data.get("age")
    ward = data.get("ward")

    response = supabase.table("patient").insert({
        "name": name,
        "age": age,
        "ward": ward
    }).execute()

    if response.data:
        return jsonify({"message": "Patient added successfully", "patient": response.data[0]}), 201
    return jsonify({"error": "Insert failed"}), 500
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