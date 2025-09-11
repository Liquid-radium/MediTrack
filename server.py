from flask import Flask, jsonify, request, render_template
import os
from supabase import create_client

app = Flask(__name__)

# --- Supabase client ---
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

# --- Routes ---

# Serve the frontend UI
@app.route("/")
def home():
    return render_template("index.html")


# 1. Fetch patient details after QR scan
@app.route("/patient/<pid>", methods=["GET"])
def get_patient(pid):
    response = supabase.table("patient").select("*").eq("patient_id", pid).execute()
    if response.data:
        return jsonify(response.data[0])
    return jsonify({"error": "Patient not found"}), 404


# 2. Fetch latest vitals for patient
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


# 3. Add new vitals (from smart band sensor gateway)
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


# --- Run the app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
