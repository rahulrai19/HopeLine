# HopeLine

Frontend setup (Vite + React)

- cd Frontend
- npm install
- npm run dev

Key routes

- /student (landing/login)
- /student/dashboard
- /student/assessment
- /student/support (flex → grid responsive support chooser)
- /student/self-help, /student/peer, /student/counselor, /student/feedback, /student/crisis
- /admin (admin login)
- /admin/dashboard (shows admin session + logout)

Notes

- Header has a single Admin button. It routes to admin login if logged out; after login it routes to admin dashboard. Status pills were removed from header and moved into the admin dashboard.

Backend (optional API)

- cd Backend
- npm install
- create `.env` (see the `.env.example` file)
- npm run dev

Endpoints

- POST /api/auth/login
- POST /api/auth/register
- POST /api/appointments/book (protected)
- POST /api/feedback/submit
HopeLine:- An Application used for Development of a Digital Mental Health and Psychological Support System for Students in Higher Education
`By Team Verbose(0)`
