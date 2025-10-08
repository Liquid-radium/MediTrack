from flask import Flask, jsonify, request, send_file, redirect
from flask_cors import CORS
import os
from dotenv import load_dotenv
import io
import qrcode
from supabase import create_client

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend (React/TS) to communicate with backend

# --- Supabase Setup ---
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)


# --- Root Route ---
@app.route("/")
def home():
    return jsonify({
        "message": "Hospital Management API",
        "endpoints": {
            "GET /patients": "Fetch all patients",
            "GET /patient/<id>": "Fetch patient details",
            "POST /add_patient": "Add a new patient",
            "PUT /edit_patient/<id>": "Update patient details",
            "DELETE /delete_patient/<id>": "Discharge patient",
            "GET /get_vitals/<id>": "Fetch latest vitals"
        }
    })


# --- QR Code Generation ---
@app.route("/generate_qr/<patient_id>", methods=["GET"])
def generate_qr(patient_id):
    try:
        base_url = request.host_url + "patient/"
        full_url = f"{base_url}{patient_id}"
        img = qrcode.make(full_url)

        img_io = io.BytesIO()
        img.save(img_io, "PNG")
        img_io.seek(0)
        return send_file(img_io, mimetype="image/png", as_attachment=True,
                         download_name=f"patient_{patient_id}.png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Get All Patients ---
@app.route("/patients", methods=["GET"])
def get_all_patients():
    try:
        response = supabase.table("patient").select("*").execute()
        if response.data:
            return jsonify(response.data)
        return jsonify({"error": "No patients found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Get Single Patient ---
@app.route("/patient/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    try:
        response = supabase.table("patient").select("*").eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify(response.data[0])
        return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Add New Patient ---
@app.route("/add_patient", methods=["POST"])
def add_patient():
    try:
        data = request.get_json()
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Edit Patient Record ---
@app.route("/edit_patient/<int:patient_id>", methods=["PUT"])
def edit_patient(patient_id):
    try:
        data = request.get_json()
        update_data = {key: value for key, value in data.items() if key in ["name", "age", "ward"]}

        if not update_data:
            return jsonify({"error": "No fields to update"}), 400

        response = supabase.table("patient").update(update_data).eq("patient_id", patient_id).execute()

        if response.data:
            return jsonify({"message": "Patient updated successfully", "patient": response.data[0]})
        return jsonify({"error": "Update failed or patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Delete (Discharge) Patient ---
@app.route("/delete_patient/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    try:
        response = supabase.table("patient").delete().eq("patient_id", patient_id).execute()
        if response.data:
            return jsonify({"message": f"Patient {patient_id} discharged successfully!"})
        return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Get Latest Vitals ---
@app.route("/get_vitals/<int:patient_id>", methods=["GET"])
def get_vitals(patient_id):
    try:
        response = (
            supabase.table("vitals")
            .select("*")
            .eq("patient_id", patient_id)
            .order("timestamp", desc=True)
            .limit(1)
            .execute()
        )

        if response.data:
            return jsonify(response.data[0])
        return jsonify({"error": "No vitals found for this patient"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Enforce HTTPS in Production ---
@app.before_request
def enforce_https():
    if not request.is_secure and os.environ.get("FLASK_ENV") == "production":
        url = request.url.replace("http://", "https://", 1)
        return redirect(url, code=301)
    


# --- Run App ---
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
