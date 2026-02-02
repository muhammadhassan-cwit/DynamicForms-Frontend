# DynamicForms Frontend

A Next.js frontend for the DynamicForms application - a TypeForm-like system for creating and managing dynamic forms.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** React Context
- **Form Handling:** react-hook-form

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend server running on http://localhost:5000

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Project Structure
```
src/
├── app/                    # Next.js App Router (pages)
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # Reusable components
│   ├── ui/                 # Basic UI components
│   └── layout/             # Layout components
├── lib/                    # Utilities
│   ├── api.ts              # Axios client
│   └── auth-service.ts     # Auth API functions
├── context/                # React Context
│   └── auth-context.tsx    # Auth state management
├── types/                  # TypeScript types
│   └── index.ts            # All types
└── hooks/                  # Custom hooks
    └── use-auth.ts         # Auth hook
```

## Pages

| Page | URL | Description | Auth Required |
|------|-----|-------------|---------------|
| Login | /login | User login page | No |
| Dashboard | /dashboard | Main dashboard | Yes |
| Forms | /dashboard/forms | List all forms | Yes |
| Create Form | /dashboard/forms/new | Create new form | Yes |
| Edit Form | /dashboard/forms/[id] | Edit form | Yes |
| Public Form | /forms/[id] | Public form for submission | No |
| Submission | /submissions/[id] | View submission | No |

## Features

- [x] Project setup
- [x] Axios client with interceptors
- [x] Auth context (login state management)
- [x] TypeScript types
- [x] Login page
  - [x] Form validation with react-hook-form
  - [x] API integration
  - [x] Redirect if already logged in
  - [x] Error handling
- [ ] Dashboard
- [ ] Form builder
- [ ] Public form page
- [ ] Submissions viewer

## Authentication Flow
```
1. User visits /login
2. User enters email & password
3. Frontend validates input
4. Frontend sends POST /auth/login to backend
5. Backend returns { token, user }
6. Frontend saves token & user to localStorage
7. Frontend updates AuthContext
8. User redirected to /dashboard
```

## API Integration

All API calls go through `src/lib/api.ts` which:
- Automatically attaches JWT token to requests
- Handles 401 errors (redirects to login)
- Uses base URL from environment variables

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Backend Repository

This frontend connects to the DynamicForms Backend:
- Repository: [DynamicForms-Backend](https://github.com/muhammadhassan-cwit/DynamicForms-Backend)
- API Base URL: http://localhost:5000/api/v1