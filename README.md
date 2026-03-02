# HIP-MINI

HIP-MINI is an internal API management portal designed to simulate an enterprise API lifecycle workflow.  
The project focuses on API creation, role-based access control, and administrative approval processes.

The architecture is modular and structured to support additional lifecycle modules such as API management and subscriptions.

---

## Tech Stack

Frontend:
- Angular
- TypeScript
- RxJS
- HTML / CSS

Backend:
- Node.js
- Express
- JWT-based authentication
- REST API design

Database:
- MongoDB (Atlas or local instance)

---

## Implemented Modules

### API Creation
- Multi-step form for creating APIs  
- Environment selection (DEV)  
- Versioning support  
- APIs are created in DRAFT state until approved  

### Approval Workflow (Admin Role)
- Admin-only access to approval page  
- List view of submitted APIs  
- Approve / Reject actions  
- Status management (Draft → Approved / Rejected)  
- Basic search and filtering  

### Role-Based Access Control
- Admin users can access the Approval module  
- Non-admin users can access Create API  
- Module visibility controlled by user role  

---

## Modules In Progress

- Manage APIs  
- Subscriptions  

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npm start
