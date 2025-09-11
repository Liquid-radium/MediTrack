import qrcode

# The base URL of your deployed Flask app
BASE_URL = "https://software-part.onrender.com/patient/"

def generate_patient_qr(patient_id):
    # Build the URL
    url = f"{BASE_URL}{patient_id}"
    # Generate the QR code
    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill="black", back_color="white")
    filename = f"patient_{patient_id}.png"
    img.save(filename)
    print(f"✅ QR code generated for patient ID {patient_id}: {filename}")

if __name__ == "__main__":
    # Example usage: generate QR for patient_id = 5
    patient_id = int(input("Enter patient ID: "))
    generate_patient_qr(patient_id)
