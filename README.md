# 🗺️ Smart Routing App

A modern web application for route optimization that helps users find the most efficient paths between multiple destinations using advanced routing algorithms.

![Smart Routing App Screenshot](./frontend/public/assets/Application.png)

## 🌐 Live Demo

- **Frontend**: [smart-routing-app-1.onrender.com](https://smart-routing-app-1.onrender.com)
- **Backend API**: Deployed on [Render](https://render.com)
- **Database**: Hosted on [Neon](https://neon.tech) (PostgreSQL)

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login with JWT tokens
- Personalized experience with saved routes per user

### 🗺️ Interactive Map
- Built on **OpenStreetMap** technology via React Leaflet
- Click anywhere on the map to add location markers
- Search for locations by name with autocomplete suggestions
- Real-time route visualization on the map

### 🛣️ Route Optimization
- **Travelling Salesman Algorithm** - Finds the shortest route visiting all markers
- **Route Types:**
  - 🔄 **Round Trip** - Returns to the starting point
  - ➡️ **One-Way Route** - Ends at the last destination
- **Transportation Modes:**
  - 🚗 Car
  - 🚴 Bicycle  
  - 🚶 Walking

### 📁 Route Management
- **Save Routes** - Name and save your routes for future use
- **Import from CSV** - Import locations from CSV files (format: `title,lng,lat`)
- **Drag & Drop** - Adjust routes in real-time by dragging waypoints

### 🧭 Turn-by-Turn Directions
- Detailed step-by-step navigation instructions
- Distance and estimated time for each segment

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI Framework |
| Vite | 7.0.0 | Build Tool |
| React Leaflet | 5.0.0 | Map Component |
| Bootstrap | 5.3.7 | Styling |
| React Router | 7.6.3 | Routing |
| Font Awesome | 6.7.2 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 5.2 | Web Framework |
| Django REST Framework | 3.16.0 | API |
| Simple JWT | 5.4.0 | Authentication |
| Gunicorn | 23.0.0 | WSGI Server |
| WhiteNoise | 6.8.2 | Static Files |

### Database & Hosting
| Service | Purpose |
|---------|---------|
| Neon | PostgreSQL Database (Cloud) |
| Render | Frontend & Backend Hosting |

### External APIs
| API | Purpose |
|-----|---------|
| OpenStreetMap | Free maps and geographic data |
| OpenCage Data | Geocoding (address to coordinates) |
| OpenRouteService | Route calculation and optimization |

---

## 📋 Prerequisites

Before running locally, ensure you have:

- **Node.js** v18 or higher
- **Python** v3.10 or higher
- **PostgreSQL** database (or Neon account)
- API keys for:
  - [OpenCage Data](https://opencagedata.com/) (Geocoding)
  - [OpenRouteService](https://openrouteservice.org/) (Routing)

---

## ⚡ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/spasovskibojan/Smart-routing-app.git
cd Smart-routing-app
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your database credentials
# (see Environment Variables section below)

# Run migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Start the development server
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_OPENCAGE_API_KEY=your_opencage_api_key
```

### Backend (`backend/.env`)
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📂 Project Structure

```
smart-routing-app/
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/         # Login, Register, Protected Routes
│   │   │   ├── Controls/     # Route type & transport controls
│   │   │   ├── Map/          # Map view & handlers
│   │   │   ├── Routes/       # Save/Load routes functionality
│   │   │   └── Sidebar/      # Main sidebar UI
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/                  # Django REST API
│   ├── api/                  # Route optimization endpoints
│   ├── users/                # Authentication & user management
│   ├── backend/              # Django settings
│   ├── requirements.txt
│   ├── manage.py
│   └── build.sh              # Render deployment script
│
└── README.md
```

---

## 🎯 Usage Guide

1. **Register/Login** - Create an account or sign in
2. **Add Locations** - Click on the map or search for places
3. **Choose Route Type** - Select Round Trip or One-Way
4. **Select Transport** - Pick Car, Bicycle, or Walking
5. **Optimize Route** - Click "Optimize Route" to calculate the best path
6. **View Directions** - See step-by-step navigation in the sidebar
7. **Save Route** - Give your route a name and save it for later
8. **Load Routes** - Access your saved routes anytime

---

## 🚀 Deployment

### Render Deployment

The app is configured for deployment on Render with:

- **Backend**: Python web service with `build.sh` for setup
- **Frontend**: Static site with Vite build
- **Environment Variables**: Set in Render dashboard

### Database (Neon)

Using Neon's serverless PostgreSQL:
1. Create a database on [neon.tech](https://neon.tech)
2. Copy the connection string to your environment variables
3. The backend will auto-migrate on deployment

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | Login and get JWT |
| POST | `/users/logout` | Logout user |
| GET | `/users/me` | Get current user info |
| GET | `/api/saved-routes/` | List user's saved routes |
| POST | `/api/saved-routes/` | Save a new route |
| DELETE | `/api/saved-routes/{id}/` | Delete a saved route |
| POST | `/api/find-optimal-route` | Calculate optimized route |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [OpenRouteService](https://openrouteservice.org/) for routing API
- [OpenCage](https://opencagedata.com/) for geocoding API
- [Leaflet](https://leafletjs.com/) for mapping library
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Render](https://render.com/) for hosting