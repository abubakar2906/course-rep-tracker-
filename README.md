# Course Rep Tracker 🎓

A comprehensive management system designed for Course Representatives to efficiently track student attendance, manage assignments, and maintain course-related records.

## Features

- **Dashboard & Analytics**: Visualize class statistics and tracking progress.
- **Student Management**: Full CRUD operations for student profiles, including matric numbers and levels.
- **Course Management**: Organize trackers by specific courses and semesters.
- **Attendance Tracking**: Create and manage attendance sessions for lectures and practicals.
- **Assignment Tracking**: Monitor student submissions and status.
- **Authentication**: Secure access with JWT and Google OAuth 2.0 integration.
- **Responsive Design**: Premium UI with support for both Light and Dark modes.

## Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (Shadcn UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express v5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Auth**: [Passport.js](https://www.passportjs.org/) (JWT & Google Strategies)

## Project Structure

```text
course-rep-tracker/
├── Backend/           # Express API with Prisma
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # Source code (controllers, routes, middlewares)
│   └── tsconfig.json # TypeScript configuration
├── Frontend/          # Next.js Application
│   ├── app/          # App Router (pages and layouts)
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   └── public/       # Static assets
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Google OAuth Credentials (for social login)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your_secret"
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   FRONTEND_URL="http://localhost:3000"
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## License
This project is licensed under the ISC License.
