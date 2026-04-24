# Logistical-Router-App

A full-stack Logistical routing and ELD (Electronic Logging Device) calculator built with **Django** and **React**. This application allows users to input trip details (start, end, and intermediate stops) to generate an interactive route map and programmatically generate daily driver log sheets. It features a custom routing algorithm that strictly enforces **FMCSA HOS (Hours of Service) compliance**.

![Logistical Router App Banner](client/public/favicon.svg)

## ✨ Features

- 🚦 **Route Optimization:** Fetches precise distances, durations, and polyline paths using the Google Maps Directions API.
- 🗺️ **Interactive Maps:** Visualizes routes and stops using `react-leaflet`.
- 🚚 **HOS Calculator (ELD):** Evaluates the 11-hour driving / 14-hour duty cycle rules to provide compliance events for routes and generates graphical log sheets programmatically.
- 🪪 **Secure Authentication:** 
  - Standard Email/Password login.
  - Native Google Identity Services OAuth integration with custom JWT validation.
  - Secure, `HttpOnly`, Cross-Domain Cookie support for seamless SPA integration.
- 📱 **Responsive UI:** A modern, mobile-responsive user interface built with Tailwind CSS, featuring glassmorphism and smooth animations.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS v4, custom CSS variables
- **Routing:** React Router DOM
- **Maps:** Leaflet, React-Leaflet
- **Authentication:** Google OAuth (`@react-oauth/google`)
- **HTTP Client:** Axios with JWT interceptors

### Backend (Server)
- **Framework:** Django 5.0, Django REST Framework (DRF)
- **Authentication:** `dj-rest-auth`, `django-allauth`, `djangorestframework-simplejwt`
- **Database:** PostgreSQL (production via Neon), SQLite (local)
- **External APIs:** Google Maps Directions API, Google OAuth 2.0 API

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (Optional, for production setup)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Logistical-Router-App.git
cd Logistical-Router-App
```

### 2. Backend Setup
Navigate to the `server` directory:
```bash
cd server
```

Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `server` directory and add the following keys:
```env
# Database connection string (e.g., Neon PostgreSQL URL)
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Google Cloud Project Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Run database migrations:
```bash
python manage.py migrate
```

Start the Django development server:
```bash
python manage.py runserver
```
*The backend API will run on `http://localhost:8000/api/v1/`.*

### 3. Frontend Setup
Open a new terminal window and navigate to the `client` directory:
```bash
cd client
```

Install Node.js dependencies:
```bash
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will be accessible at `http://localhost:5173/`.*

---

## 📁 Project Structure

```text
Logistical-Router-App/
├── client/                 # React frontend application
│   ├── public/             # Static assets (favicons, etc.)
│   ├── src/
│   │   ├── components/     # Reusable React components (Maps, LogSheets, Forms)
│   │   ├── contexts/       # React context providers (AuthContext)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # Axios API integrations
│   │   ├── App.jsx         # Main application routing
│   │   └── main.jsx        # React entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
└── server/                 # Django backend API
    ├── logistics_app/      # Main Django app (Models, Views, URLs)
    ├── logistics_backend/  # Django project settings
    ├── requirements.txt    # Python dependencies
    └── manage.py           # Django execution script
```

## 🌐 Deployment

### Backend (Render / Heroku)
The backend is structured for easy deployment on PaaS providers like Render.
1. Add the necessary environment variables to your web service.
2. The `gunicorn` web server is included in `requirements.txt`.
3. Use the following start command:
   ```bash
   gunicorn logistics_backend.wsgi:application
   ```

### Frontend (Vercel / Netlify)
1. Set the build command to `npm run build`.
2. Set the publish directory to `dist`.
3. Ensure you add `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` to your deployment environment variables.

---

## 📝 License
[MIT License](LICENSE)
