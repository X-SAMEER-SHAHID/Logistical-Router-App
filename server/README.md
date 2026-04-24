# Logistical Router Backend

The Django backend API for the **Logistical Router Application**. It handles trip route calculations via the Google Directions API, Hours of Service (HOS) logic, and secure Cross-Origin Authentication.

## Features
- 🚦 **Route Optimization:** Fetches distances, durations, and polyline paths using the Google Directions API.
- 🪪 **Custom Authentication:** 
  - Standard Email/Password login.
  - Native Google Identity Services OAuth integration with custom JWT validation.
  - Secure, `HttpOnly`, Cross-Domain Cookie support for seamless SPA integration.
- 🚚 **HOS Calculator:** Evaluates the 11-hour driving / 14-hour duty cycle rules to provide compliance events for routes.
- 🗄️ **Database:** Configured for PostgreSQL (Neon) with seamless SQLite fallback for local development.

## Tech Stack
- **Framework:** Django 5.0 & Django REST Framework (DRF)
- **Authentication:** `dj-rest-auth`, `django-allauth`, `djangorestframework-simplejwt`
- **Database:** PostgreSQL (production), SQLite (local)
- **External APIs:** Google Maps Directions API, Google OAuth 2.0 API

## Environment Variables
Create a `.env` file in the `server/` directory with the following variables:

```env
# Database connection string (e.g., Neon PostgreSQL URL)
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Google Cloud Project Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Local Development Setup

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or `venv\Scripts\activate` on Windows
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start the Development Server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/v1/`.

## Deployment (Render)

This backend is structured to be deployed easily on Render (or Railway/Heroku).
1. Add the environment variables to your Render Web Service.
2. The `gunicorn` web server is included in `requirements.txt`.
3. Start Command for Render:
   ```bash
   gunicorn logistics_backend.wsgi:application
   ```
4. **Important for Cross-Domain Auth:** Ensure your Render server has the `GOOGLE_CLIENT_ID` matching the exact ID in your frontend to allow the custom Google Login view to validate tokens.
