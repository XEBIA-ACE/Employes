# Employee Portal

A production-ready, feature-rich Angular 17 application for managing employee services within an organization.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Docker](#docker)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based login with token refresh, remember me, and role-based access |
| **Dashboard** | KPI cards, department breakdown, announcements, upcoming birthdays, recent activity |
| **Employee Management** | Full CRUD — list, search, filter, paginate, view detail, create/edit with stepper form |
| **Leave Management** | Submit leave requests, track balances per type, manager approval workflow |
| **Profile** | View personal info, change password |
| **Role-Based Access** | Admin / HR / Manager / Employee roles with route & UI guards |
| **Responsive Design** | Mobile-first, collapsible sidebar, adaptive grids |

---

## Architecture

The app follows **Clean Architecture** with clear module boundaries:

```
src/app/
├── core/               # Singleton services, guards, interceptors, models
│   ├── guards/         # AuthGuard, RoleGuard
│   ├── interceptors/   # AuthInterceptor, LoggingInterceptor, ErrorInterceptor
│   ├── models/         # TypeScript interfaces for all domain entities
│   └── services/       # AuthService, EmployeeService, LeaveService, DashboardService, …
├── shared/             # Re-usable UI components, pipes, directives (exported via SharedModule)
│   ├── components/     # Header, Sidebar, LoadingSpinner, ConfirmationDialog
│   ├── directives/     # HasRoleDirective (*appHasRole)
│   └── pipes/          # InitialsPipe, LeaveStatusPipe, EmploymentStatusPipe
└── features/           # Lazy-loaded feature modules
    ├── auth/           # Login page
    ├── dashboard/      # Home dashboard
    ├── employees/      # Employee CRUD
    ├── leave/          # Leave requests & balances
    └── profile/        # Personal profile & password change
```

### Data Flow

```
Component → Service (Observable) → HTTP Interceptor → REST API
                                           ↕
                                   Auth / Error / Logging interceptors
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 |
| UI Library | Angular Material 17 + CDK |
| Styling | SCSS + Angular Material Theming |
| State | RxJS BehaviorSubject |
| Forms | Angular Reactive Forms |
| Routing | Angular Router (lazy-loaded modules) |
| HTTP | Angular HttpClient + Interceptors |
| Testing | Jasmine + Karma |
| Server | Nginx (production) |
| Container | Docker + Docker Compose |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Angular CLI 17: `npm install -g @angular/cli`

### Local Setup (Without Docker)

```bash
# 1. Clone the repository
git clone <repo-url>
cd employee-portal

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start development server (port 4200)
npm start
```

The app will be available at **http://localhost:4200**.

> API calls are proxied to `http://localhost:3000` via `proxy.conf.json`. Start your backend server on port 3000 or modify the proxy target.

### Build for Production

```bash
npm run build:prod
# Output: dist/employee-portal/
```

---

## Project Structure

```
employee-portal/
├── src/
│   ├── app/
│   │   ├── core/                  # Core module (singleton)
│   │   ├── shared/                # Shared module (imported everywhere)
│   │   └── features/              # Feature modules (lazy-loaded)
│   ├── assets/                    # Static assets
│   ├── environments/              # Environment configs
│   ├── styles/                    # Global SCSS
│   ├── index.html
│   └── main.ts
├── Dockerfile                     # Multi-stage production build
├── Dockerfile.dev                 # Development image
├── docker-compose.yml             # Local dev stack
├── nginx.conf                     # Nginx SPA config with security headers
├── karma.conf.js                  # Test runner config
├── angular.json                   # Angular workspace config
├── tsconfig.json                  # TypeScript config (strict mode)
├── proxy.conf.json                # Dev server API proxy
└── package.json
```

---

## Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `apiUrl` | `http://localhost:3000/api/v1` | Backend API base URL |
| `production` | `false` | Production mode flag |
| `logging.level` | `debug` | Log level: `debug`, `info`, `warn`, `error` |
| `logging.enableConsole` | `true` | Enable/disable console logging |
| `features.leaveManagement` | `true` | Toggle leave management module |
| `features.performanceReview` | `false` | Toggle performance review (future) |

Edit `src/environments/environment.ts` (dev) or `environment.prod.ts` (prod).

---

## API Integration

The app expects a REST API at `/api/v1`. All requests include a `Bearer` token via `AuthInterceptor`.

### Expected Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/logout` | Logout |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/change-password` | Change password |
| `GET` | `/dashboard/stats` | Dashboard statistics |
| `GET` | `/announcements` | Company announcements |
| `GET` | `/employees` | List employees (paginated) |
| `POST` | `/employees` | Create employee |
| `GET` | `/employees/:id` | Get employee by ID |
| `PATCH` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |
| `GET` | `/departments` | List departments |
| `GET` | `/positions` | List positions |
| `GET` | `/leaves` | List leave requests |
| `POST` | `/leaves` | Create leave request |
| `PATCH` | `/leaves/:id/cancel` | Cancel leave request |
| `PATCH` | `/leaves/:id/review` | Approve/reject leave |
| `GET` | `/leave-balances` | Get leave balances |

### Standard Response Format

```json
{
  "data": { ... },
  "message": "Success",
  "timestamp": "2026-02-23T10:00:00.000Z"
}
```

### Paginated Response Format

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Authentication

Authentication uses **JWT tokens** stored in `localStorage`.

- **Login** → `POST /auth/login` → stores `ep_token`, `ep_refresh_token`, `ep_user`
- **Auto-refresh** → `AuthInterceptor` detects `401` and attempts token refresh
- **Logout** → clears localStorage and navigates to `/auth/login`
- **Route protection** → `AuthGuard` blocks unauthenticated navigation
- **Role protection** → `RoleGuard` restricts routes by `data.roles`

### Roles

| Role | Access Level |
|---|---|
| `admin` | Full access |
| `hr` | Employee management, leave approvals |
| `manager` | View team employees, leave approvals |
| `employee` | Own profile, own leave requests |

---

## Docker

### Development

```bash
# Start all services (frontend + backend)
docker compose up

# Frontend only
docker compose up frontend
```

### Production Build

```bash
# Build production image
docker build -t employee-portal:latest .

# Run production container
docker run -p 80:80 employee-portal:latest

# Or with docker compose
docker compose --profile prod up nginx
```

The production image uses a two-stage build:
1. **Builder** — Node 20 Alpine, runs `ng build --configuration production`
2. **Server** — Nginx 1.25 Alpine, serves the built assets with optimized config

---

## Testing

```bash
# Run all tests (watch mode)
npm test

# CI mode (headless, coverage)
npm run test:ci

# Coverage report → coverage/employee-portal/index.html
```

### Test Structure

```
src/
└── app/
    ├── core/
    │   ├── services/
    │   │   ├── auth.service.spec.ts      ← Unit tests for AuthService
    │   │   └── employee.service.spec.ts  ← Unit tests for EmployeeService
    │   └── guards/
    │       └── auth.guard.spec.ts        ← Unit tests for AuthGuard
    ├── shared/
    │   └── pipes/
    │       └── initials.pipe.spec.ts     ← Unit tests for InitialsPipe
    └── features/
        └── auth/login/
            └── login.component.spec.ts   ← Component tests for LoginComponent
```

---

## Key Design Decisions

### Module Architecture
- **CoreModule** — imported once in `AppModule`, registers HTTP interceptors, guards, and singleton services
- **SharedModule** — re-exports Angular Material, CommonModule, ReactiveFormsModule, and shared UI components for convenience
- **Feature Modules** — lazy-loaded to reduce initial bundle size

### HTTP Interceptors (ordered)
1. `LoggingInterceptor` — logs request/response timing
2. `AuthInterceptor` — attaches Bearer token, handles 401 / token refresh
3. `ErrorInterceptor` — maps error codes to user-friendly snackbar messages

### State Management
Lightweight RxJS `BehaviorSubject` used in `AuthService`. For larger apps, consider NgRx or Akita.

### Security
- JWT in `localStorage` (suitable for SPAs; consider `httpOnly` cookies for stricter environments)
- Nginx security headers: `CSP`, `X-Frame-Options`, `Referrer-Policy`, etc.
- Input validation on all forms (Reactive Forms + Angular validators)
- Role-based UI hiding via `*appHasRole` directive and `RoleGuard`

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT © Employee Portal Team
