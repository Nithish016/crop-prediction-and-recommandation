# Smart Agro AI – Crop Recommendation & Disease Detection System

A complete full-stack AI-powered agricultural web application built for MSME farming startups. The platform provides real-time crop suggestions, leaf pathogen diagnostics, commodity mandi pricing, meteorology analytics, and role-based notifications (Farmer and Gov/Admin portals).

---

## Technical Stack

* **Frontend:** Next.js (React), Tailwind CSS, Axios, Lucide Icons
* **Backend:** Node.js + Express.js (MVC architecture)
* **Database:** MongoDB + Mongoose (with automated memory fallback mode for local demoing)
* **Authentication:** JWT with role-based access controls, Password hashing (bcrypt)

---

## Directory Layout

```text
├── backend/
│   ├── config/          # Database connections
│   ├── controllers/     # Controller logic (Auth, Farmer, Admin)
│   ├── middleware/      # Auth security guard middleware
│   ├── models/          # Schemas for MongoDB
│   ├── routes/          # API endpoint routes mapping
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Node server bootstrap
└── frontend/
    ├── src/
    │   ├── app/         # Next.js pages routing layout
    │   ├── components/  # Nav bars and sidebar widgets
    │   └── context/     # Auth React context & Axios handlers
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Setup & Running Locally

### Prerequisites
* [Node.js](https://nodejs.org) (v18+ recommended)
* MongoDB (Optional - the application automatically falls back to an in-memory/demo mode if MongoDB is not detected or offline so that the system remains fully interactive immediately!)

### Step 1: Clone and Configure Environment variables

1. Copy `.env.example` to `.env` in the `backend/` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Configure credentials in `backend/.env`:
   * `PORT`: Server port (default: 5000)
   * `MONGODB_URI`: MongoDB connection string (e.g. `mongodb://localhost:27017/smart_agro_ai`)
   * `JWT_SECRET`: Random string for JWT encoding

### Step 2: Install and Launch Backend API
```bash
cd backend
npm install
npm run dev
```
The server will start listening at `http://localhost:5000`.

### Step 3: Install and Launch Frontend App
Open a new terminal shell:
```bash
cd frontend
npm install
npm run dev
```
The Next.js client will boot at `http://localhost:3000`.

---

## Demo Credentials & Access

* **Farmer Portal:** Register a new farmer account through the signup page, or log in to existing accounts.
* **Government / Admin Dashboard:**
  * **Email:** `admin@smartagro.gov`
  * **Password:** `admin123`

---

## API Endpoints Reference

### Authentication
* `POST /api/auth/register` - Create farmer accounts
* `POST /api/auth/login` - Authenticate users

### Farmer Dashboard Services
* `POST /api/crop/predict` - Soil parameters NPK crop recommendation
* `POST /api/disease/detect` - Leaf diagnostic scan and treatment plan
* `GET /api/market/prices` - Fetch live commodity prices
* `GET /api/weather` - Meteorology reports
* `GET /api/alerts` - Receive notifications broadcasted by Admins

### Admin Dashboard Services
* `GET /api/admin/dashboard` - Stats summaries & activity log lists
* `GET /api/admin/reports` - Fetch all diseases registered
* `POST /api/admin/alerts` - Broadcast an alert to all farmers

---

## Deployment Guidelines

### Frontend (Vercel)
1. Initialize a Git repository in `frontend/` (or the root workspace).
2. Connect repository to [Vercel](https://vercel.com).
3. Set Environment Variable:
   * `NEXT_PUBLIC_API_URL` = `<your-deployed-backend-url>/api`
4. Deploy.

### Backend (Render / Railway)
1. Deploy the `backend/` subfolder.
2. Set Environment Variables:
   * `JWT_SECRET` = `<your-secret-key>`
   * `MONGODB_URI` = `<your-mongodb-atlas-url>`
3. Set start command: `node server.js`.
