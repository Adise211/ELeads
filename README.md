# EdgarLeads

A modern lead management system built with React, TypeScript, and Node.js. EdgarLeads helps businesses track, manage, and convert leads with a comprehensive dashboard, user management, and activity tracking.

## 🚀 Features

- **Lead Management**: Create, edit, and track leads with detailed information
- **User Management**: Role-based access control with Admin, Manager, and User roles
- **Activity Tracking**: Log emails, calls, meetings, and other activities for each lead
- **Dashboard Analytics**: Visual charts and metrics for lead performance
- **Workspace Support**: Multi-tenant workspace management
- **Permission System**: Granular permissions for different user roles
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Zustand** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** as ORM with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for input validation

### Database

- **PostgreSQL** with Prisma migrations

## 📁 Project Structure

```
edgarLeads/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── stores/       # Zustand stores
│   │   ├── services/     # API services
│   │   └── routes/       # Routing configuration
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # Prisma models
│   ├── routes/          # API routes
│   └── prisma/          # Database schema and migrations
└── shared/              # Shared types and constants
    └── types/           # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd edgarLeads
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in both `client/` and `server/` directories:

   Ask me for the env files!

4. **Set up the database**

   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**

   **Terminal 1 - Start the backend:**

   ```bash
   cd server
   npm run dev:watch
   ```

   **Terminal 2 - Start the frontend:**

   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 🔧 Available Scripts

### Client (Frontend)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Server (Backend)

```bash
npm run dev          # Start development server
npm run dev:watch    # Start with file watching
npm run build        # Build TypeScript
npm run prod         # Start production server
npm run migrate      # Run database migrations
npm run studio       # Open Prisma Studio
```

## 🎨 UI Components

Built with a modern component library using:

- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Adise** - Lead developer and maintainer

---

For more information, check out the API documentation in `client/src/docs`.
