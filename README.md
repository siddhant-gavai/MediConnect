# MediConnect 🏥

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

**MediConnect** is a premium, modern, startup-grade full-stack Doctor Appointment & Patient Management System. Built with the PERN stack (Postgres, Express, React, Node) and Prisma ORM, it offers a seamless experience for patients to book appointments and doctors to manage their schedules.

## ✨ Features

- **High-End UI/UX**: Premium medical theme with glassmorphism, modern design, and Framer Motion animations.
- **Search & Discovery**: Interactive doctor search with filters for speciality and availability.
- **Appointment Lifecycle**: Complete flow from booking to status management (Pending, Confirmed, Completed).
- **Multi-Role Dashboards**: Specialized interfaces for Patients, Doctors, and Administrators.
- **Slot Management**: Real-time time-slot allocation and booking prevention.
- **Reviews & Ratings**: Secure patient feedback system for medical professionals.
- **Authentication**: Secure JWT-based auth with role-based access control (RBAC).

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS v4, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma 7 |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **File Storage** | Cloudinary (Integration Ready) |

## 📁 Folder Structure

```text
MediConnect/
├── backend/            # Express server, Prisma schema, and Business logic
│   ├── prisma/         # Database schema and migrations
│   ├── src/            # Backend source code (Controllers, Routes, Middlewares)
│   └── ...
├── frontend/           # React 18 application with Tailwind CSS v4
│   ├── src/            # Components, Hooks, Pages, and Contexts
│   ├── public/         # Static assets and images
│   └── ...
└── README.md           # Documentation
```

## 🚀 Setup Instructions

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables (see below).
4. Run Prisma migrations and generate client:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
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

## 🔐 Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5001
DATABASE_URL="postgresql://user:password@localhost:5432/mediconnect"
JWT_SECRET="your_jwt_secret"
FRONTEND_URL="http://localhost:5173"

# Optional integrations
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/doctors` | Get all verified doctors |
| `GET` | `/api/doctors/:id` | Get detailed doctor profile |
| `POST` | `/api/appointments` | Book a new appointment |

## 📸 Screenshots

*(Screenshots coming soon...)*

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
