# server.py
from flask import Flask, request, jsonify
import mysql.connector
from datetime import datetime

app = Flask(__name__)

# Cloud DB connection
def get_conn():
    return mysql.connector.connect(
        host="your-db-host.amazonaws.com",
        user="dbuser",
        password="dbpassword",
        database="hospital_db"
    )

# Insert vitals
@app.route("/add_vitals", methods=["POST"])
def add_vitals():
    data = request.json
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Vitals(patient_id, timestamp, heart_rate, spo2, temp, bp)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["patient_id"],
        datetime.now(),
        data["heart_rate"],
        data["spo2"],
        data["temp"],
        data["bp"]
    ))
    conn.commit()
    conn.close()
    return jsonify({"status": "ok", "message": "Vitals added"})

# Fetch last 5 vitals
@app.route("/patient/<pid>/vitals", methods=["GET"])
def get_vitals(pid):
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT timestamp, heart_rate, spo2, temp, bp
        FROM Vitals WHERE patient_id=%s
        ORDER BY timestamp DESC LIMIT 5
    """, (pid,))
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
