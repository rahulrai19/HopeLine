# HopeLine - Digital Mental Health Platform

A comprehensive digital mental health and psychological support system for university students.

## Features

- **Student Dashboard**: Personalized mental health tracking and resources
- **AI Companion**: 24/7 intelligent chatbot with multilingual support
- **Peer Support**: Anonymous community chat and group sessions
- **Professional Counseling**: Book appointments with licensed counselors
- **Assessment Tools**: PHQ-9 and GAD-7 mental health assessments
- **Admin Panel**: Comprehensive system management and analytics
- **Mood Tracking**: Global mood context with personalized insights
- **Data Visualization**: Real-time analytics and reporting

## Tech Stack

- **Frontend**: React, Vite, SCSS, React Router
- **Backend**: Node.js, Express, MongoDB, JWT
- **AI Integration**: Google Gemini API
- **Authentication**: JWT-based auth system
- **Database**: MongoDB with comprehensive data models

## Quick Start

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

### Database Setup
```bash
cd Backend
npm run seed  # Populate database with sample data
```

## Environment Variables

Create a `.env` file in the Backend directory with:
```
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

## Database Models

- **User**: Students, counselors, and admins
- **Appointment**: Counseling session bookings
- **Feedback**: Session ratings and comments
- **ChatSession**: AI, peer, and counselor chat interactions
- **Assessment**: PHQ-9 and GAD-7 mental health assessments
- **SystemLog**: System activity and error tracking

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

### Appointments
- `POST /api/appointments/book` - Book counseling appointment

### Feedback
- `POST /api/feedback/submit` - Submit session feedback

### AI Chat
- `POST /api/ai/chat` - AI chat interaction

### Analytics
- `GET /api/analytics/overview` - Dashboard overview statistics
- `GET /api/analytics/users/trends` - User registration trends
- `GET /api/analytics/chat/analytics` - Chat session analytics
- `GET /api/analytics/assessments/analytics` - Assessment analytics
- `GET /api/analytics/appointments/analytics` - Appointment analytics
- `GET /api/analytics/system/health` - System health metrics
- `GET /api/analytics/activity/feed` - Real-time activity feed

## Demo Credentials

- **Student**: `student@university.edu` / `admin123`
- **Admin**: `admin` / `admin123`

## Data Visualization Features

- **Real-time Metrics**: User counts, session statistics, ratings
- **Interactive Charts**: Session types, mood distribution, severity levels
- **Trend Analysis**: User growth, assessment patterns, appointment trends
- **System Monitoring**: Error tracking, performance metrics, activity logs
- **Satisfaction Tracking**: Star ratings and feedback analysis

## Admin Dashboard Features

- **Overview Statistics**: Key performance indicators
- **User Management**: Student and counselor administration
- **Case Monitoring**: Track counseling sessions and outcomes
- **Reports & Analytics**: Comprehensive data visualization
- **System Health**: Monitor system performance and errors
- **Activity Feed**: Real-time system activity tracking

## Key Routes

- `/` - Student landing page
- `/student/dashboard` - Student dashboard
- `/student/assessment` - Mental health assessments
- `/student/support` - Support options chooser
- `/student/self-help`, `/student/peer`, `/student/counselor`, `/student/feedback`, `/student/crisis`
- `/admin` - Admin login
- `/admin/dashboard` - Admin dashboard with analytics

## Notes

- Header has a single Admin button that routes to admin login if logged out; after login it routes to admin dashboard
- Status pills were removed from header and moved into the admin dashboard
- Responsive design with mobile-first approach
- Dark theme throughout the application
- Real-time data visualization in admin panel

---

**HopeLine**: An Application for Development of a Digital Mental Health and Psychological Support System for Students in Higher Education

*By Team Verbose(0)*