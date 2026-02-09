# DynamicForms Frontend

A modern, responsive frontend for the DynamicForms platform — a TypeForm-like multi-tenant system where companies can create dynamic forms and collect submissions.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Form Validation:** React Hook Form
- **Toast Notifications:** Sonner (for success/error feedback)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Backend running at `http://localhost:5000` (or your backend URL)

### Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/muhammadhassan-cwit/DynamicForms-Frontend.git
cd DynamicForms-Frontend
npm install
```

### Environment Setup

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run Development Server

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to view the app.

---

## Features

### Authentication

- **Login with email and password**
- **JWT token-based authentication**
- Auth state persistence with **localStorage**
- **Protected dashboard routes** for authenticated users only

### Dashboard

- **Header** with user info and logout
- **Sidebar navigation** with role-based UI (admin vs employee)
- Admin can manage and view form submissions

### Forms Management

- View all forms as **cards with skeleton loading** for better UX
- **Create new forms** with dynamic field builder
- View **form details** with a public URL for sharing
- **Delete forms** (admin only)
- Supported field types:
  - Text, Email, Number, Date, Textarea, Select, Checkbox, Radio, and more

### Public Form Submission

- **Public form page** accessible without login
- Dynamic field rendering from the database schema
- **Client-side validation** (required fields, email format, etc.)
- **Success page** with a link to view submission
- "Powered by DynamicForms" footer

### Submissions

- View **submission result** (public, secured with `submissionId` + `email`)
- Admins can see a **submissions list** per form
- Admins can view **submission details**
- **Delete submissions** with optimistic updates (admin only)
- Employees can **view** submissions but not delete them

### Toast Notifications

- **Success and error toasts** for user feedback after key actions (e.g., form submission, deletion, login)
- **Sonner** is used for displaying toasts at the top-right of the page with rich colors and close buttons
- Real-time feedback for **form creation**, **submissions**, **deletions**, and more

---

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
│   │       └── [id]/                          # Form details
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
│   │   ├── header.tsx                          # Dashboard header (includes logout button)
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

| Method | Endpoint     | Description            |
|--------|--------------|------------------------|
| POST   | /auth/login  | User login             |
| POST   | /auth/logout | User logout            |

### Forms (Protected)

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | /forms             | List all forms        |
| GET    | /forms/:id         | Get form details      |
| POST   | /forms             | Create new form       |
| DELETE | /forms/:id         | Delete form (admin)   |

### Submissions (Protected)

| Method | Endpoint                 | Description            |
|--------|--------------------------|------------------------|
| GET    | /forms/:formId/submissions| List submissions for a form |
| GET    | /submissions/:submissionId| Get submission details |
| DELETE | /submissions/:submissionId| Delete submission (admin) |

### Public (No Auth)

| Method | Endpoint                           | Description                |
|--------|------------------------------------|----------------------------|
| GET    | /public/forms/:formId             | Get public form            |
| POST   | /public/forms/:formId/submit      | Submit form response       |
| GET    | /public/submissions/:id?email=x   | View submission result     |
```

---

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

- `feat/project-setup`
- `feat/login-page`
- `feat/dashboard`
- `feat/forms-list`
- `feat/form-builder`
- `feat/view-form`
- `feat/public-form`
- `fix/error-messages`
- `feat/submission-viewer`
- `feat/admin-submissions`

## Backend Repository

[DynamicForms Backend](https://github.com/muhammadhassan-cwit/DynamicForms-Backend)

