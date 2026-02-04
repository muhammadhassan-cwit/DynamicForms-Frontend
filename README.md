# DynamicForms Frontend

A modern, responsive frontend for the DynamicForms platform — a TypeForm-like multi-tenant system where companies can create dynamic forms and collect submissions.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Form Validation:** React Hook Form

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Backend running at `http://localhost:5000`

### Installation
```bash
git clone https://github.com/muhammadhassan-cwit/DynamicForms-Frontend.git
cd DynamicForms-Frontend
npm install
```

### Environment Setup

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Features

### Authentication

- Login with email and password
- JWT token-based authentication
- Auth state persistence with localStorage
- Protected dashboard routes

### Dashboard

- Header with user info and logout
- Sidebar navigation
- Role-based UI (admin vs employee)

### Forms Management

- View all forms (cards with skeleton loading)
- Create new forms with dynamic field builder
- View form details with public URL
- Delete forms (admin only)
- Supported field types: text, email, number, date, textarea, select

### Public Form Submission

- Public form page (no login required)
- Dynamic field rendering from database schema
- Client-side validation (required fields, email format)
- Success page with link to view submission
- "Powered by DynamicForms" footer

### Submissions

- View submission result (public, secured with submissionId + email)
- Admin submissions list per form
- Admin submission detail view
- Delete submissions with optimistic updates (admin only)
- Employee can view but not delete

## Project Structure
```
src/
├── app/
│   ├── layout.tsx                              # Root layout (AuthProvider)
│   ├── page.tsx                                # Home (redirect logic)
│   ├── login/page.tsx                          # Login page
│   ├── dashboard/
│   │   ├── layout.tsx                          # Dashboard layout (header + sidebar)
│   │   ├── page.tsx                            # Dashboard home
│   │   └── forms/
│   │       ├── page.tsx                        # Forms list
│   │       ├── new/page.tsx                    # Create form
│   │       └── [id]/
│   │           ├── page.tsx                    # View form details
│   │           └── submissions/page.tsx        # Submissions list
│   │   └── submission-detail/
│   │       └── [submissionId]/page.tsx         # Submission detail
│   └── submit/
│       ├── [formId]/page.tsx                   # Public form page
│       └── result/[submissionId]/page.tsx      # Public submission result
├── components/
│   ├── form-builder/
│   │   └── field-editor.tsx                    # Field configuration component
│   ├── layout/
│   │   ├── header.tsx                          # Dashboard header
│   │   └── sidebar.tsx                         # Dashboard sidebar
│   └── ui/
│       └── skeleton.tsx                        # Skeleton loading component
├── context/
│   └── auth-context.tsx                        # Authentication context
├── hooks/
│   └── use-auth.ts                             # Auth hook
├── lib/
│   ├── api.ts                                  # Axios instance with interceptors
│   ├── auth-service.ts                         # Auth API functions
│   ├── form-service.ts                         # Form API functions
│   └── submission-service.ts                   # Submission API functions
└── types/
    └── index.ts                                # TypeScript interfaces
```

## API Endpoints Used

### Auth (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | User login |
| POST | /auth/logout | User logout |

### Forms (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /forms | List all forms |
| GET | /forms/:id | Get form details |
| POST | /forms | Create new form |
| DELETE | /forms/:id | Delete form (admin) |

### Submissions (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /forms/:formId/submissions | List submissions for a form |
| GET | /submissions/:submissionId | Get submission details |
| DELETE | /submissions/:submissionId | Delete submission (admin) |

### Public (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /public/forms/:formId | Get public form |
| POST | /public/forms/:formId/submit | Submit form response |
| GET | /public/submissions/:id?email=x | View submission result |

## Git Workflow

- `main` — production
- `dev` — development
- `feat/feature-name` — new features
- `fix/bug-name` — bug fixes

### Commit Prefixes

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance
- `docs:` — documentation

## Completed Branches

- feat/project-setup
- feat/login-page
- feat/dashboard
- feat/forms-list
- feat/form-builder
- feat/view-form
- feat/public-form
- fix/error-messages
- feat/submission-viewer
- feat/admin-submissions

## Backend Repository

[DynamicForms Backend](https://github.com/muhammadhassan-cwit/DynamicForms-Backend)