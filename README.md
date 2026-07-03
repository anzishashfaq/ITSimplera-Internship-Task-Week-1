# TaskFlow — Task Management Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application built for the
**ITSimplera Fullstack Web Development Internship — Week 1 Task**.

It implements user authentication, JWT-protected REST API, full task CRUD,
and a responsive React dashboard with search, filtering, pagination, charts,
and a light/dark theme.

---

## Features

### Frontend
- Login, Register, Dashboard, Profile, Create Task, Edit Task pages
- Responsive navbar + collapsible sidebar navigation
- Dashboard summary cards and a status pie chart
- Responsive, mobile-friendly data table (collapses to stacked cards on small screens)
- Dark / light theme toggle (persisted in localStorage)
- Loading spinners on every async action
- Toast notifications (success / error / info) via `react-toastify`
- Client-side form validation with inline error messages
- Centralized Axios error handling + interceptors

### Backend
- Node.js + Express REST API
- User registration & login
- Password hashing with `bcryptjs`
- JWT authentication with expiry
- Protected routes via auth middleware
- Full CRUD for tasks (create, read, update, delete)
- Request validation via `express-validator`
- Proper HTTP status codes (200/201/400/401/404/500)
- Centralized error-handling middleware

### Database (MongoDB)
- `users` collection — name, email, hashed password, avatar, bio
- `tasks` collection — title, description, priority, status, dueDate, createdAt (via timestamps)

### Additional features implemented (6 of the required 5)
- Search tasks (MongoDB text search)
- Filter by status
- Filter by priority
- Pagination
- User profile update
- Password change
- Dashboard statistics (totals by status/priority)
- Recent activity panel
- Responsive chart (pie chart via Recharts)
- Auto logout when the JWT expires

---

## Project Structure

```
Task-Management-System/
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, DataTable, DashboardCard, Loader...
│   │   ├── pages/          # Login, Register, Dashboard, Profile, CreateTask, EditTask
│   │   ├── context/        # AuthContext, ThemeContext
│   │   └── services/       # Axios API layer
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/
│   ├── models/             # User.js, Task.js
│   ├── routes/
│   ├── middleware/         # auth, validation, error handler
│   ├── config/db.js
│   ├── utils/generateToken.js
│   └── server.js
│
├── package.json             # root convenience scripts
└── README.md
```

---

## Prerequisites

Install these first:

| Tool | Link |
|---|---|
| Node.js (LTS) | https://nodejs.org |
| MongoDB Community Server | https://www.mongodb.com/try/download/community |
| MongoDB Compass (optional GUI) | https://www.mongodb.com/products/compass |
| Git | https://git-scm.com/downloads |

You can also use a free **MongoDB Atlas** cluster instead of a local install — just
put the connection string in `MONGO_URI`.

---

## Setup & Run Locally

### 1. Clone / unzip the project
```bash
cd Task-Management-System
```

### 2. Configure environment variables

**Server** — copy the example file and fill in your own secret:
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/task-management-system
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRE=1d
CLIENT_URL=http://localhost:5173
```

**Client** — copy the example file:
```bash
cd ../client
cp .env.example .env
```
Edit `client/.env` if your API runs somewhere other than `http://localhost:5000/api`.

### 3. Install dependencies

From the project root you can install everything at once:
```bash
npm run install-all
```
Or install each part manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Make sure MongoDB is running
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows / Linux — start the "MongoDB" service, or run:
mongod
```

### 5. Run the app

**Option A — run both servers together (from the project root):**
```bash
npm run dev
```

**Option B — run them separately (two terminals):**
```bash
# Terminal 1
cd server
npm run dev
# API running at http://localhost:5000

# Terminal 2
cd client
npm run dev
# App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser, register a new account, and
start creating tasks.

---

## API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in, receive JWT | Public |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/users/profile` | Update name/bio/avatar | Private |
| PUT | `/users/change-password` | Change password | Private |
| GET | `/tasks` | List tasks (search/filter/paginate) | Private |
| GET | `/tasks/:id` | Get single task | Private |
| POST | `/tasks` | Create task | Private |
| PUT | `/tasks/:id` | Update task | Private |
| DELETE | `/tasks/:id` | Delete task | Private |
| GET | `/tasks/stats/summary` | Dashboard statistics | Private |

All private routes require the header:
```
Authorization: Bearer <token>
```

You can test the API with **Postman** (https://www.postman.com/downloads).

---

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Recharts, React Icons, React Toastify
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JSON Web Tokens (JWT), bcrypt.js
- **Validation:** express-validator (server), custom inline validation (client)

---

## Notes for Submission

- Commit early and often with meaningful messages to reflect good Git practice.
- Add screenshots of the running app (login, dashboard, create/edit task, dark mode)
  to your documentation.
- Do **not** commit `.env` files — only the provided `.env.example` files are tracked.
