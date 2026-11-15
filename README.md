# 🚀 SMART RECRUITMENT ATS — Smart Recruitment and Applicant Tracking System

**Simplify recruitment. Manage applications. Connect talent with opportunities.**

Smart Recruitment ATS is a web-based Applicant Tracking System designed to streamline the recruitment process. It provides separate interfaces for Candidates, HR personnel, and Administrators to manage job opportunities, applications, and recruitment activities.

## 🌐 About the Project

Recruitment involves multiple stages, from publishing job openings to reviewing applications and selecting suitable candidates.

Smart Recruitment ATS brings these activities together in one platform. HR personnel can create and manage job postings, candidates can explore opportunities and apply for jobs, and administrators can access administrative features.

The system aims to make recruitment more organized, accessible, and efficient.

## ✨ Features

- 👤 **Role-Based Authentication:** Separate access for Admin, HR, and Candidate users.
- 💼 **Job Management:** HR users can create, update, and manage job postings.
- 📢 **Job Publishing:** Publish job openings for candidates to view.
- 🔎 **Job Browsing:** Candidates can explore available job opportunities.
- 📝 **Online Applications:** Candidates can apply for published jobs.
- 📂 **Application Management:** HR users can view and manage received applications.
- 🔄 **Application Status Tracking:** Track recruitment progress through different application stages.
- 👨‍💼 **Candidate Profiles:** Maintain candidate information and professional details.
- 🛡️ **Secure Authentication:** JWT-based authentication and password hashing.
- 🗄️ **Database Integration:** Store users, jobs, and applications in PostgreSQL.
- 📱 **Responsive Interface:** Web interface designed for different screen sizes.

## 🛠️ Built With

**Frontend**
- React.js
- Vite
- JavaScript
- CSS3
- React Router
- Lucide React

**Backend**
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- bcryptjs
- Zod

**Database and Deployment**
- PostgreSQL
- Neon Database
- Render
- GitHub Pages
- Git and GitHub

## 🎯 Objective

The objective of Smart Recruitment ATS is to simplify and organize the recruitment process by connecting candidates, HR personnel, and administrators through a centralized platform.

The system supports the core recruitment workflow:

1. HR creates and publishes a job.
2. Candidates browse available jobs.
3. Candidates submit applications.
4. HR reviews received applications.
5. HR updates application statuses throughout the selection process.

## 👥 User Roles

### 🛡️ Administrator
- Access the administrative dashboard.
- Access administrative user-management features.

### 👨‍💼 HR
- Access the HR dashboard.
- Create and manage job postings.
- Publish job opportunities.
- View candidate applications.
- Manage application statuses.

### 🎓 Candidate
- Access the candidate dashboard.
- Browse published job opportunities.
- Apply for available positions.
- View submitted applications.

## ▶️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/sscarlleet/smart-recruitment-ats.git
```

### 2. Open the project

```bash
cd smart-recruitment-ats
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Configure the frontend

Create or configure the frontend environment settings if required by your local setup.

### 5. Start the frontend

```bash
npm run dev
```

### 6. Configure the backend

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure the required environment variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

### 7. Generate Prisma Client and run migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

For a new local development database where migrations need to be created, use the project's existing migration workflow.

### 8. Start the backend

```bash
npm run dev
```

The frontend and backend should now be running locally.

## 🌐 Live Demo

**Frontend:** [Smart Recruitment ATS](https://sscarlleet.github.io/smart-recruitment-ats/)

**Backend:** [Smart Recruitment ATS API](https://smart-recruitment-ats.onrender.com/)

## 📂 Project Structure

```text
smart-recruitment-ats/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── server.js
│   │
│   ├── storage/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

## 🔐 Security

The application includes security measures such as:

- JWT-based authentication.
- Password hashing using bcryptjs.
- Role-based route authorization.
- Request validation using Zod.
- Protected API endpoints.
- Environment-based configuration for sensitive credentials.

## 🚀 Future Improvements

Potential future enhancements include:

- Resume parsing and automated candidate screening.
- AI-powered candidate-job matching.
- Interview scheduling and management.
- Offer letter generation.
- Recruitment analytics and reports.
- Email and notification integration.
- Advanced candidate filtering and search.
- Cloud-based resume storage.

## 👨‍💻 Project

**SMART RECRUITMENT ATS — Smart Recruitment and Applicant Tracking System**

Developed as a full-stack web application to simplify recruitment and applicant tracking.

**Find talent. Manage applications. Build better teams.** 🚀
