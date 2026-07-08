# Digital Library Management System

A production-ready, full-stack Digital Library Management System built utilizing the MVC architectural pattern. It allows members to search and browse catalogs, while enforcing rigid Role-Based Access Control (RBAC) boundaries that empower authenticated Librarians (Admins) to manage inventory records, book status life cycles, and authors directories seamlessly.

---

## Quick Summary

* **Server Framework:** Node.js + Express.js
* **Database Engine:** PostgreSQL (interfaced via connection pool client `pg`)
* **View Architecture:** EJS Template Engine rendering high-contrast layouts
* **Authentication:** JSON Web Tokens (JWT) issued and securely stored in state-managed `HTTP-only` cookies
* **Cross-Site Request Forgery Protection:** Stateful token checks powered by `csurf` middleware
* **Flash Notifications:** Integrated `connect-flash` with transactional tracking backed by `express-session` cookies

---

## Files of Interest

```text
├── app.js                          # Main Application Server & Orchestrator
├── database/
│   └── schema.sql                  # Complete Database Schema Script with Check Constraints
├── config/
│   └── db.js                       # PostgreSQL Database Connection Pool Initialization
├── middleware/
│   └── authMiddleware.js           # RBAC Verification and Session Gatekeepers
├── public/
│   └── style.css                   # Central layout styles and theme configurations
├── routes/
│   ├── authorsRoutes.js            # Endpoints routing for Author operations
│   ├── authRoutes.js               # Endpoints routing for Authentication sessions
│   ├── bookRoutes.js               # Endpoints routing for Book Inventory requests
│   └── borrowRoutes.js             # Endpoints routing for Borrowing transactions
├── controllers/
│   ├── authController.js           # Registration, Login, Session Management Hooks
│   ├── bookController.js           # Book Catalogs Core Business Logic & Queries
│   ├── authorController.js         # Author Registries Core Business Logic
│   └── borrowController.js         # Check-out & Return Ledger Calculators
├── models/
│   ├── userModel.js                # Users Active Record Operations (bcrypt hooks)
│   ├── bookModel.js                # Books Inventory Table Trackers
│   ├── authorModel.js              # Authors Profiles Schema Mappers
│   └── borrowModel.js              # Borrowing History Transaction Logs
└── views/
    ├── auth/
    │   ├── login.ejs               # Standardized Clean Portal Access Form
    │   └── register.ejs            # Unified High-contrast Registration Layout
    ├── books/
    │   ├── index.ejs               # Public Catalog Display Grid & Search Inputs
    │   ├── admin.ejs               # Librarian Books Dashboard Controls
    │   ├── create.ejs              # New Book Insertion and Author Select Interface
    │   └── edit.ejs                # Dynamic Existing Book Parameter Adjuster
    ├── authors/
    │   ├── index.ejs               # Unified Authors Registry Directory View
    │   ├── create.ejs              # Librarian Author Onboarding Sheet
    │   └── edit.ejs                # Biographical Records Modifier Frame
    └── partials/
        ├── header.ejs              # Central Structural Navigation Frame
        └── footer.ejs              # Document Closures & Universal Scaffolding

```

---

## Prerequisites

* **Node.js** (v18.x or newer version recommended)
* **PostgreSQL Instance** (Running locally or hosted)
* **Node Package Manager (npm)** available via shell pipelines

---

## Environment Configuration (`.env`)

Create a .env file in the project root with the following variables:

```env
DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=library_db
DB_PASSWORD=your_database_password
JWT_SECRET=strong_secret_for_JWT_signing
SESSION_SECRET=strong_secret_for_express-session
PORT=5000

```

Note: SESSION_SECRET and JWT_SECRET must be strong and kept secret in production.

---

## Installation

Run the dependency resolver execution node:

```bash
npm install

```

---

## Running the Application

To run the platform under active deployment runtime states with automatic reload triggers via `nodemon`:

```bash
npm run dev

```

The ecosystem server infrastructure will bind onto the configured socket address, defaulting online at: `http://localhost:5000`.

---

## Database Setup

1. Log into your PostgreSQL interactive shell context or administration command console tool:
```sql
CREATE DATABASE library_db;

```


2. Target your operations scope context directly onto the newly allocated data partition layer.
3. Apply the schema structure blueprints found inside `database/schema.sql` to initialize constraints, relationships, and tables:
```sql
-- Instantiates the complete tables hierarchy cleanly:
-- users -> authors -> books -> borrow_records

```



> **Data Validation Rule:** The platform actively enforces string state validation limits directly on database engine tiers using a strict check constraint filter mapping permitted book statuses down to exact system variations (`available`, `borrowed`, `reserved`).

---

## Primary Routes Matrix

###  Authentication Operations

* `GET  /auth/register` — Access the registration window framework.
* `POST /auth/register` — Evaluates data metrics, saves user, hashes password, injects active JWT cookie.
* `GET  /auth/login` — Access unified workspace validation screens.
* `POST /auth/login` — Evaluates profile records, generates explicit validation state token, sets cookie.
* `POST /auth/logout` — Destroys current security token references inside HTTP-Only cookie storage profiles (CSRF-protected).

###  Book Catalog Management

* `GET  /books` — Renders active inventory listings (Fully supports parameterized user lookup/search fields).
* `GET  /books/admin` — Master asset grid panels for librarians (**Librarian Access Required**).
* `GET  /books/create` — Entry configuration screens for adding a title (**Librarian Access Required**).
* `POST /books` — Commits new parameters to relational storage indices (CSRF-protected, **Librarian Access Required**).
* `GET  /books/:id/edit` — Prepopulated book modifier fields (**Librarian Access Required**).
* `POST /books/:id/edit` — Dispatches update query updates back down cleanly onto data tiers (CSRF-protected, **Librarian Access Required**).
* `POST /books/:id/delete` — Purges targeted book assets from system records globally (CSRF-protected, **Librarian Access Required**).

###  Authors Directory Management

* `GET  /authors` — Access indexed registry details across all stored authors.
* `GET  /authors/create` — Author profiles creation interface (**Librarian Access Required**).
* `POST /authors` — Adds a fresh profile listing to the tracking array indices (CSRF-protected, **Librarian Access Required**).
* `GET  /authors/:id/edit` — Form to adjust existing biographical entries (**Librarian Access Required**).
* `POST /authors/:id/edit` — Updates targeted entity description entries securely (CSRF-protected, **Librarian Access Required**).

###  Transactional Check-out Ledger

* `POST /borrow/:id` — Checks out an item, updates history metrics, flags asset as `borrowed` (**Normal Member Access Required**).
* `POST /return/:id` — Flags returned properties back into circulation pools as `available`.

---

## Security Summary

* **Role Isolation Mechanics (RBAC):** Middleware checks identify explicit field markers on incoming user records (`admin` versus `user`). Standard members are limited to catalog lookups and borrowing, while administrative write privileges stay behind route validation barriers.
* **Cryptographic Vaulting:** Raw password profiles are converted into one-way cryptographic strings through strong background passes before any persistent database write steps execute.
* **Attack Surface Hardening:** Form modifications that change structural system parameters (including deletions, creations, and logs) are validated by backend validation blocks tracking valid `csurf` tokens.
* **Secure Browsing Storage Configuration:** Security authentication structures utilize isolated tracking states locked strictly into `HTTP-only` cookie formats. This mitigates client script injection attack pathways (XSS) completely.

---

## UX & Features

* **Cohesive Design System Theme:** Powered by a clean Modern Slate + Indigo palette stylesheet (`public/style.css`) that separates interface hierarchies cleanly, ensuring visible, high-contrast typography across all display surfaces.
* **Dynamic Lifecycle Badging:** Interactive inventory panels feature semantic status tracking indicators (e.g., vibrant emerald labels highlighting an `available` asset state alongside amber indicators marking active `borrowed` properties).
* **Bookmark-Safe Queries:** The main product discovery directory leverages native browser query parameters via clean `GET` endpoints, allowing specific queries to be shared or bookmarked easily.

---

## Course & Student Information

* **Institution/Course:** Web Programming II
* **Student:** Yeabkal Wondwosen — ID: 163/BSC-B6/2023
