# Logistical Router Frontend

The frontend for the **Logistical Router Application**, built with React, Vite, and Tailwind CSS v4. It features a modern, glassmorphism-inspired design with real-time Google Maps integration and global routing capabilities.

## Features
- 🗺️ **Interactive Maps:** Real-time route rendering using the Google Maps API.
- 🔐 **Authentication:** Email/Password and Google OAuth integration using Google Identity Services.
- 📱 **Responsive Design:** Optimized for both desktop and mobile using Tailwind CSS v4.
- ⚡ **Performance:** Extremely fast HMR and optimized builds powered by Vite.
- 🕒 **HOS Compliance:** Visualizes Hours of Service constraints dynamically on the dashboard.

## Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 & Vanilla CSS
- **Icons:** Google Material Symbols Outlined
- **Routing:** React Router v6
- **HTTP Client:** Axios (configured for cross-domain cookies)

## Environment Variables
Create a `.env` file in the `client/` directory with the following variables:

```env
# Your backend API URL (Use localhost for local development)
VITE_API_URL=http://localhost:8000/api/v1

# Google Cloud Project Credentials
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
```
*Note: Make sure your `VITE_GOOGLE_CLIENT_ID` has no trailing spaces or newlines.*

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Deployment (Vercel)

This frontend is optimized for deployment on Vercel. 
The project includes a `vercel.json` file to handle SPA routing rewrites to `index.html`.

When deploying to Vercel, ensure you:
1. Add the environment variables in the Vercel Dashboard.
2. Set `VITE_API_URL` to your production backend URL (e.g., `https://your-backend.onrender.com/api/v1`).
3. Add your Vercel URL to the **Authorized JavaScript origins** and **Authorized redirect URIs** in your Google Cloud Console.
