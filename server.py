from flask import Flask, jsonify, request, render_template, send_file
import os
from dotenv import load_dotenv
import io
import qrcode
from supabase import create_client

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
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


@app.route("/patient/<pid>", methods=["GET"])
def get_patient(pid):
    response = supabase.table("patient").select("*").eq("patient_id", pid).execute()
    if response.data:
        return jsonify(response.data[0])
    return jsonify({"error": "Patient not found"}), 404


@app.route("/patient/<pid>/vitals", methods=["GET"])
def get_vitals(pid):
    response = (
        supabase.table("vitals")
        .select("*")
        .eq("patient_id", pid)
        .order("timestamp", desc=True)
        .limit(1)
        .execute()
    )
    if response.data:
        return jsonify(response.data[0])
    return jsonify({"error": "No vitals found"}), 404


@app.route("/add_vitals", methods=["POST"])
def add_vitals():
    data = request.json
    pid = data.get("patient_id")
    heart_rate = data.get("heart_rate")
    spo2 = data.get("spo2")

    if not pid:
        return jsonify({"error": "Missing patient_id"}), 400

    response = supabase.table("vitals").insert(
        {"patient_id": pid, "heart_rate": heart_rate, "spo2": spo2}
    ).execute()

    if response.data:
        return jsonify({"message": "Vitals added successfully"})
    return jsonify({"error": "Insert failed"}), 500

@app.route("/add_patient", methods=["POST"])
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


@app.route("/edit_patient/<pid>", methods=["PUT"])
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


# --- Run the app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
