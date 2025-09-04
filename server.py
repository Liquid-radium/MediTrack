from flask import Flask, jsonify, request
import os
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# --- Database connection helper ---
def get_conn():
    return psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
        dbname=os.environ.get("DB_NAME"),
        port=5432
    )

# --- API Endpoints ---

@app.route("/")
def home():
    return jsonify({"message": "SmartBand API running 🚀"})

# 1. Fetch patient details after QR scan
@app.route("/patient/<pid>", methods=["GET"])
def get_patient(pid):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM patients WHERE patient_id = %s", (pid,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        return jsonify(row)
    return jsonify({"error": "Patient not found"}), 404

# 2. Fetch latest vitals for patient
@app.route("/patient/<pid>/vitals", methods=["GET"])
def get_vitals(pid):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT * FROM vitals
        WHERE patient_id = %s
        ORDER BY timestamp DESC LIMIT 1
    """, (pid,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        return jsonify(row)
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

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO vitals (patient_id, heart_rate, spo2) VALUES (%s, %s, %s)",
        (pid, heart_rate, spo2)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Vitals added successfully"})

# --- Run locally ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
