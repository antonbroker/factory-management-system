# Factory Management System

Full-stack web application for managing employees, departments, and shifts in a factory environment. 
The project simulates a real production management system with authentication, action limits, 
and optional AI-powered shift schedule generation.

## Overview
The production management system is a full-featured CRUD + AI project that simulates a real factory management system:
workers, departments, and shifts. The project includes authentication, action restrictions, a well-thought-out layer architecture, 
and integration with OpenAI for scheduling.

## Tech Stack
Backend:
- Node.js + Express
- MongoDB + Mongoose
- Layered Architecture (Controllers → Services → Repositories → Models)
- JWT authentication + middleware-based authorization
- OpenAI API integration
- JSONPlaceholder API (login simulation)

Frontend:
- React
- TypeScript
- Vite
- Modular component-based architecture
- Protected routes
- Centralized API layer
- Responsive UI

## 🌐 Live Demo

**Backend (Render):**  
- https://factory-backend-2.onrender.com

**Frontend (Vercel):**  
- https://factory-management-system-adfjost8g-anton-iosifovs-projects.vercel.app/


### 🔐 Test Login

Use the following user or another from *https://jsonplaceholder.typicode.com/users* (external API for login):

- Username: `Bret`  
- Email: `Sincere@april.biz`


## Backend Architecture Overview
```txt
backend/
│── app.js                     # Main Express application
│── package.json
│── package-lock.json
│
├── config/
│   └── db.js                  # MongoDB connection setup
│
├── controllers/               # Request / response handling
├── services/                  # Business logic layer
├── repositories/              # Database access layer
├── models/                    # Mongoose models
├── routers/                   # Express routers
├── middlewares/               # Auth & daily action limiter
└── data/                      # Action logs & AI output

```

## Frontend Architecture Overview
```txt
frontend/
├── src/
│   ├── api/            # API layer
│   ├── components/     # Reusable components
│   ├── layouts/        # Protected layouts
│   ├── pages/          # Feature pages
│   ├── types/          # TypeScript models
│   ├── utils/          # Auth & helpers
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── package.json

```

## How to Run Locally
### Backend:
1. Install backend dependencies:
- npm install

2. Create .env file:
- MONGODB_URI=your-mongodb-uri
- JWT_SECRET=your-jwt-secret
- OPENAI_API_KEY=your-openai-api-key # optional (for AI scheduling)

3. Start backend:
- npm start
- By default the server runs on http://localhost:3000.

4. Open frontend:
- cd frontend
- npm install
- npm run dev

5. Create .env file:
- VITE_API_BASE_URL=http://localhost:3000


## Features
Authentication Flow:
- Login uses username + email - JSONPlaceholder API (https://jsonplaceholder.typicode.com/users).
- Users are auto-created in MongoDB and issued a JWT token.

Daily Actions Limit:
- Each user has 10 actions/day.
- GET does not count.
- POST/PUT/DELETE reduce the counter.
- Resets daily.

Main Features:
- Employees: view, filter by department, add employee, edit employee, assign shifts.
- Departments: add department, edit manager, view employees.
- Shifts: create shift, assign employee to shift, visualize with badges.
- AI Schedule Generator. AI button for future week schedule generation.

AI Schedule Generator (Optional)
- Generates weekly shift schedule using OpenAI
- Produces downloadable Excel file
- Disabled automatically if API key is missing

### AI Schedule Generator (OpenAI):
This project includes an AI feature that automatically generates a weekly shift schedule
for all employees based on their departments and availability.

The feature uses the OpenAI API.
- Uses OpenAI API to generate weekly schedule.
- Requires OPENAI_API_KEY in .env.

### How it works
- The frontend has an **AI Schedule** button.
- When clicked, the client sends a request to `/useAI/generateSchedule`.
- The backend:
  - collects employee + shift data
  - sends a structured prompt to OpenAI
  - receives a generated weekly plan
  - returns the result to the frontend
- The result is formatted and can be downloaded as an Excel file.

To use the AI feature, the user must provide:
- OPENAI_API_KEY=your-openai-api-key
- Add this to your `.env` file.
- Without this key, the AI feature will be disabled (other functionality works normally).

## REST API Documentation:
**Authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/login` | Login using username + email (JSONPlaceholder). Creates user in DB if not exists. Returns JWT. |

**Users**

| Method |   Endpoint   |                 Description                 |             
|--------|--------------|---------------------------------------------|
|  GET   |  `/users`    | Get all system users                        |
|  GET   | `/users/:id` | Get user by ID                              |
|  POST  | `/users`     | Create user (internal use by login service) |

**Employees**

| Method |     Endpoint     |     Description       |
|--------|------------------|-----------------------|
|  GET   | `/employees`     | Get all employees     |
|  GET   | `/employees/:id` | Get employee by ID    |
|  POST  | `/employees`     | Create a new employee |
|  PUT   | `/employees/:id` | Update employee       |
| DELETE | `/employees/:id` | Delete employee       |

**Departments**

| Method |      Endpoint      |     Description      |
|--------|--------------------|----------------------|
|  GET   | `/departments`     | Get all departments  |
|  GET   | `/departments/:id` | Get department by ID |
|  POST  | `/departments`     | Create a department  |
|  PUT   | `/departments/:id` | Update department    |
| DELETE | `/departments/:id` | Delete department    |

**Shifts**
| Method |   Endpoint    |     Description          |
|--------|---------------|--------------------------|
|  GET   | `/shifts`     | Get all shifts           |
|  POST  | `/shifts`     | Create shift             |
|  PUT   | `/shifts/:id` | Assign employee to shift |

**AI Schedule Generator**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/useAI/generateSchedule` | Generates weekly schedule using OpenAI API |

## Screenshots

### Login Page
![Login](./screenshots/login.png)

### Employees Page
![Employees](./screenshots/employees.png)
![Add employee](./screenshots/addEmployee.png)
![Edit employee](./screenshots/editEmployee.png)

### Department Page
![Departments](./screenshots/departments.png)
![Add department](./screenshots/addDepartment.png)
![Edit department](./screenshots/editDepartment.png)

### Shifts Page
![Shifts](./screenshots/shifts.png)

### Users Page
![Users](./screenshots/users.png)

### AI Schedule Generator
![AI](./screenshots/ai_schedule.png)
