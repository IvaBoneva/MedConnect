# MedConnect

MedConnect is an innovative healthcare platform designed to connect **patients**, **doctors**, and **guardians** in one unified system. The application supports appointment scheduling, prescription management, AI-powered medical consultations, and real-time health monitoring.

---

##  Features

### Patients

- **Profile Management** – Manage personal information and medical records
- **Calendar & Appointments** – Book, view, and cancel doctor appointments with Google Calendar integration
- **AI Doctor (Gemini)** – Symptom checking and AI-based medical consultations
- **Prescriptions & Medications** – Access prescriptions and medication schedules
- **Map Integration** – Find nearby pharmacies and medical centers using Google Maps
- **File Storage** – Secure upload and storage of medical documents
- **Subscriptions** – Manage subscription plans and payments via Stripe

### Doctors

- **Dashboard** – View daily schedules and upcoming examinations
- **Patient Management** – Access patient profiles and medical history
- **Electronic Prescriptions** – Issue prescriptions digitally
- **Schedule Configuration** – Define working hours and special exceptions

###  Guardians

- **Patient Monitoring** – Track schedules and health status of entrusted patients
- **Shared Calendar** – View patient appointments and events

---

## Tech Stack

### Client Side

- **Framework:** React.js
- **Styling:** CSS, PostCSS
- **Routing:** React Router
- **API Communication:** Axios
- **Maps:** Google Maps API

### Server Side

- **Framework:** Java Spring Boot
- **Build Tool:** Maven
- **Database:** PostgreSQL or MySQL (configurable)
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **External Services:**
  - Google Cloud (Calendar API, Maps API, Gemini AI)
  - Stripe (Payments)
  - Twilio (SMS Notifications)

---

## Installation & Setup

To run MedConnect locally, both the **server** and **client** applications must be configured.

### Prerequisites

- Node.js & npm
- Java JDK 17+
- Maven
- Docker (optional, for database setup)

---

## Server Setup

1. Open a terminal and navigate to the `server` directory.
2. Configure environment variables or edit `src/main/resources/application.yml` with:
   - Database credentials (URL, username, password)
   - Stripe API keys
   - Twilio API keys
   - Google Cloud credentials (`credentials.json`)
3. Install dependencies and start the server:

```bash
cd server
./mvnw spring-boot:run
```

The server will start on **http\://localhost:8080** by default.

---

## Client Setup

1. Open a new terminal and navigate to the `client` directory.
2. Install dependencies:

```bash
cd client
npm install
```

3. Start the React application:

```bash
npm start
```

The client will be accessible at [**http://localhost:3000**](http://localhost:3000).

---

## Docker Setup (Optional)

A `docker-compose.yml` file is provided in the `server` directory.

To start the services using Docker:

```bash
cd server
docker-compose up -d
```

---

## API Key Configuration

To enable full functionality, configure the following API keys:

- **Google Maps API Key** – Set in `client/public/index.html` or `.env`
- **Gemini API Key** – Required for AI Doctor functionality
- **Stripe Publishable & Secret Keys** – Required for subscriptions and payments

---

## Documentation

Detailed project documentation is available in the `docs/` directory:

- **Architecture.docx** – System architecture and design
- **Functional\_Description.docx** – Detailed feature descriptions

---

## © License

© 2025 MedConnect. All rights reserved.

