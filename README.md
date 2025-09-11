# SmartBand Patient Monitor

A web-based application to manage patient data and monitor health vitals using QR codes, built with **Flask**, **Supabase**, and **HTML5 QR code scanner**.

This project allows hospital staff or administrators to:
- Add new patients to the database.
- Edit existing patient records.
- View all patients in a table.
- Scan QR codes to quickly access patient information and latest vitals.
- Generate QR codes for patients and download them as PNG files.

---

## Technologies Used

- **Flask** – Python web framework for building APIs and serving HTML pages.
- **Supabase** – Backend-as-a-Service providing PostgreSQL database and authentication.
- **HTML5 QR Code Scanner** – JavaScript library for scanning QR codes directly from the browser.
- **JavaScript (Fetch API)** – For handling API calls between frontend and backend.
- **CSS** – Styling for a clean and user-friendly interface.

---

## Features

### Scan QR Code
Scan patient QR codes to fetch and display patient details and latest vitals.

### Add Patient
Form to add new patient records.

### Edit Patient
Update existing patient information using a form.

### View All Patients
View all patient records in a table.

### Generate QR Code
Create and download patient QR codes for easy sharing and identification.

---

## Getting Started

### Prerequisites
- Python 3.10+
- Flask (`pip install flask`)
- python-dotenv (`pip install python-dotenv`)
- supabase-py (`pip install supabase`)
- An active Supabase project with configured tables.

## Security Considerations

- Do not expose your service role key publicly. Store it securely in the .env file.
- Use SSL/TLS (HTTPS) in production to protect data in transit.
- Configure Supabase authentication rules to restrict access and operations based on user roles.

## Deployment

For production deployment:
- Use cloud platforms like Render, Heroku, or AWS.
- Add environment variables securely in the deployment dashboard.
- Set up HTTPS using SSL certificates.
- Implement user authentication and authorization for secure access.


## Future Improvements

- Add authentication and user roles (admin, nurse, doctor).
- Improve error handling with retries and notifications.
- Enhance mobile responsiveness and UI/UX.
- Provide data export options like CSV or PDF.
- Contributing
Feel free to fork the project, make improvements, and submit pull requests. Contributions are welcome!

## Contact
For questions, suggestions, or support, contact:
Shruti Hegde
littlethings.160824@gmail.com

Made with ❤️ by Shruti Hegde




