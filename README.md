# TasteAI - Agentic AI Product for Food Vloggers

TasteAI is a comprehensive platform designed for Food Vloggers, leveraging AI to enhance food discovery and recommendations. It provides an intuitive interface for users and robust management tools for administrators.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript and Vite
- **Styling:** Tailwind CSS & Framer Motion for animations
- **State Management:** Zustand (global state) & React Query (server state)
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Validation:** Zod
- **Security:** Helmet, Express Rate Limit, CORS
- **File Uploads:** Multer

---

## 📂 Project Structure

```text
TasteAI/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/      # Route logic (admin, auth, dashboard, user)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic
│   │   └── middlewares/      # Auth, validation, error handling
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/                 # React + Vite Client
    ├── src/
    │   ├── components/       # Reusable UI (Layout, Sidebar, etc.)
    │   ├── pages/            # Page components (Dashboard, Login, Admin, etc.)
    │   ├── services/         # API integration (Axios instance)
    │   ├── store/            # Zustand stores
    │   └── routes/           # Protected routing and guards
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 1. Backend Setup

1. Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` directory (if not already present) and add:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tasteai
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`*

### 2. Frontend Setup

1. Open a **second** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173` (or the port Vite provides).*

---

## 🛡️ Key Features
- **Secure Authentication:** JWT-based login, registration, and password recovery.
- **Admin Dashboard:** Manage users and monitor platform activity.
- **Role-Based Access Control:** Protected routes utilizing React Router guards.
- **Responsive UI:** Fully responsive design crafted with Tailwind CSS.
- **Optimized Performance:** Fast builds and Hot Module Replacement via Vite.
