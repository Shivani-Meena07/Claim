# Claim — Menstrual Wellness Companion

Claim is an AI-powered menstrual wellness web application designed to help users track their menstrual cycles, understand patterns, receive personalized wellness insights, and connect with healthcare professionals.

## 🚀 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Recharts
* Lucide React
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google Gemini API

---

# 📁 Project Structure

```text
Claim/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── CycleTracker.jsx
│   │   │   ├── MonthlyReport.jsx
│   │   │   ├── DoctorConnect.jsx
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   ├── lib/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup

## 1. Clone the repository

```bash
git clone <repository-url>
cd Claim
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## 3. Backend setup

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside `backend/`.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit `.env` to GitHub.

---

# ✨ Current Features

## Authentication

* User signup
* User login
* JWT authentication
* Protected routes
* User-specific data access

## Cycle Tracker

Users can:

* Log cycle start date
* Log cycle end date
* Record cycle length
* Record flow intensity
* Record symptoms
* Record pain level
* View cycle history
* Update cycle records
* Delete cycle records
* Get cycle predictions
* Get AI-generated cycle insights

## AI Chatbot

The application includes an AI menstrual wellness chatbot that provides general educational information about:

* Periods
* Menstrual cycles
* PMS
* Common symptoms
* Nutrition
* Hydration
* Exercise
* Rest
* General reproductive wellness

The chatbot does not diagnose medical conditions or prescribe medication.

## Monthly Report

The monthly report includes:

* Cycle length trends
* Symptom frequency
* Flow intensity
* Mood trends
* Sleep trends
* AI-generated monthly wellness insights
* Visual charts using Recharts

> The backend is being updated so monthly report data is generated from the logged-in user's MongoDB records instead of hardcoded frontend data.

## Doctor Connect

Users can:

* View available doctors
* View doctor specialties
* View ratings
* View experience
* View location
* View available consultation slots

Backend doctor API:

```text
GET /api/doctors
```

Booking functionality is currently being developed.

---

# 🔌 Important API Routes

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

## Cycle Tracker

```text
POST   /api/cycles
GET    /api/cycles
GET    /api/cycles/ai-insight
PUT    /api/cycles/:id
DELETE /api/cycles/:id
```

All cycle routes require JWT authentication.

## Doctors

```text
GET /api/doctors
```

## Monthly Report

```text
POST /api/reports/monthly-ai
```

This route requires authentication.

The backend should use the authenticated user's ID to retrieve their cycle data.

---

# 🎨 Frontend Development Guidelines

When working on the frontend:

* Reuse existing UI components from `components/ui`.
* Maintain the existing color/theme system.
* Use Tailwind CSS for styling.
* Keep the existing responsive design.
* Avoid hardcoding user-specific data where an API is available.
* Use the existing authentication token from `localStorage`.
* Do not expose API keys in frontend code.
* Keep components reusable and clean.

---

# 👩‍💻 Current Frontend Work

The frontend team should focus on:

### Doctor Connect

* Connect the Doctor Connect page to `GET /api/doctors`
* Replace hardcoded doctor data with API data
* Implement doctor search/filtering if required
* Display available consultation slots
* Build the booking UI once the booking API is ready

### Cycle Tracker

* Connect cycle history to backend APIs
* Ensure the UI displays the logged-in user's actual cycles
* Connect prediction data to the backend
* Handle loading and error states

### Monthly Report

* Keep the existing charts and report UI
* Remove dependency on hardcoded data when backend report data becomes available
* Display the AI-generated report cleanly
* Support Markdown formatting in the AI summary if required
* Add proper loading/error states

### General UI

* Check responsive design
* Fix UI inconsistencies
* Improve empty states
* Improve loading states
* Handle API errors gracefully
* Test navigation and protected pages

---

# 🧪 Testing

Before pushing frontend changes:

```bash
npm run dev
```

Test:

* Signup
* Login
* Dashboard
* Cycle tracker
* Cycle history
* AI chatbot
* Monthly report
* Doctor Connect
* Logout
* Protected routes

Make sure the browser console has no errors.

---

# ⚠️ Important

Never commit:

```text
.env
.env.local
node_modules/
```

API keys, MongoDB credentials, and JWT secrets must remain private.

---

# 🏆 Hackathon Goal

Claim aims to provide a single, supportive platform for menstrual wellness by combining:

**Cycle Tracking + AI Insights + Wellness Chatbot + Monthly Reports + Doctor Connect**

The goal is to make menstrual health tracking simple, personalized, and accessible while clearly distinguishing wellness information from professional medical advice.

```
```
