# HIP-MINI

A mini enterprise API lifecycle management portal — inspired by real-world Hybrid Integration Platform (HIP) systems. HIP-MINI simulates how organizations create, review, approve, and govern internal APIs, with role-based access separating administrators from regular users.

Built as a full-stack project to practice the same patterns used in production integration platforms: multi-step forms, approval workflows, JWT auth, and role-based UI/API access control.



## Features

**API Creation**
- Multi-step form for creating APIs
- Environment selection (DEV)
- Versioning support
- APIs are created in `DRAFT` state until approved

**Approval Workflow (Admin)**
- Admin-only approvals dashboard for APIs and subscriptions
- Approve / reject actions with status transitions (`DRAFT` → `APPROVED` / `REJECTED`)
- Search and filtering across submissions

**Role-Based Access Control**
- JWT-based authentication with bcrypt password hashing
- `ADMIN` role: full access, including approvals and API management
- `USER` role: can create APIs and view active/approved ones only
- Route-level guards on both frontend and backend enforce role restrictions

**In Progress**
- Manage APIs (edit/update flows beyond creation)
- Subscriptions module (backend routes exist; frontend integration pending)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, TypeScript, RxJS, Angular Router |
| Backend | Node.js, Express 5, JWT, bcryptjs |
| Database | MongoDB (Mongoose ODM) |
| Testing | Vitest |
| Tooling | Angular CLI, nodemon |

---

## Project Structure

```
hip-mini/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth + role guards
│   │   ├── routes/        # Express routers
│   │   └── server.js      # Entry point
│   └── package.json
├── frontend/
│   ├── src/app/           # Angular application
│   └── package.json
└── screenshots/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A MongoDB instance (local or MongoDB Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/PatukariSaiKiran/hip-mini.git
cd hip-mini
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5050
```

Run the backend:

```bash
npm run dev     # with nodemon (recommended for local dev)
# or
npm start
```

The API will be available at `http://localhost:5050`. Check `http://localhost:5050/health` to confirm it's running.

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

The Angular app will be available at `http://localhost:4200`.

---

## API Reference

Base URL: `http://localhost:5050`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Authenticate and receive a JWT |
| POST | `/apis` | Admin | Create a new API |
| GET | `/apis` | Authenticated | List APIs (admins see all, users see active only) |
| GET | `/apis/:apiId` | Authenticated | Get API details |
| PATCH | `/apis/:apiId` | Admin | Update an API |
| DELETE | `/apis/:apiId` | Admin | Soft-delete an API |
| GET | `/approvals/apis` | Admin | List pending API approvals |
| PATCH | `/approvals/apis/:apiId/approve` | Admin | Approve an API |
| PATCH | `/approvals/apis/:apiId/reject` | Admin | Reject an API |
| GET | `/approvals/subscriptions` | Admin | List pending subscription approvals |
| PATCH | `/approvals/subscriptions/:id/approve` | Admin | Approve a subscription |
| PATCH | `/approvals/subscriptions/:id/reject` | Admin | Reject a subscription |

---

## Roadmap

- [ ] Manage APIs module (full edit UI)
- [ ] Subscriptions module (frontend integration)
- [ ] Unit and integration test coverage
- [ ] Deployed live demo

---

## Author

**Sai Kiran Patukari**
[LinkedIn](https://linkedin.com/in/sai-kiran-patukari) · [GitHub](https://github.com/PatukariSaiKiran)
