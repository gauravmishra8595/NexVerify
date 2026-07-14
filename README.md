<div align="center">

# 🚀 NexVerify

### AI-Powered Candidate Verification & Assessment Platform

<p align="center">

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js"/>

<img src="https://img.shields.io/badge/Django-5.0-darkgreen?style=for-the-badge&logo=django"/>

<img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql"/>

<img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"/>

<img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss"/>

<img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge"/>

<img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge"/>

</p>

<p align="center">

<strong>A Full Stack Recruitment Platform that automates candidate verification, secure authentication, technical assessments, aptitude tests, analytics, and hiring workflows.</strong>

</p>

<p align="center">

<a href="https://nex-verify-1bvk.vercel.app">
<img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Project-success?style=for-the-badge"/>
</a>

<a href="https://github.com/gauravmishra8595/NexVerify">
<img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github"/>
</a>

</p>

---

## 🌐 Live Application

### 🚀 Frontend

https://nex-verify-1bvk.vercel.app

### ⚙ Backend

https://nexverify-api.onrender.com

---

# 📖 Overview

NexVerify is a modern full-stack recruitment verification platform designed to simplify and automate the hiring process.

Traditional recruitment requires recruiters to manually verify candidates, manage assessments, evaluate results, and maintain candidate records across multiple systems.

NexVerify brings everything into one centralized platform.

The application enables candidates to securely register, verify their email using OTP, complete technical and aptitude assessments, and monitor their progress through an intuitive dashboard. Recruiters and administrators can efficiently manage candidates, monitor assessment performance, and make data-driven hiring decisions through a centralized admin dashboard.

Built using **Next.js**, **Django REST Framework**, and **PostgreSQL**, NexVerify follows a scalable production-ready architecture suitable for real-world deployments.

---

# 🎯 Why NexVerify?

Recruitment teams often spend significant time verifying applicants, scheduling assessments, calculating scores, and managing candidate data manually.

NexVerify automates the entire workflow by providing:

- Secure Authentication
- Email OTP Verification
- Candidate Dashboard
- Online Assessments
- Performance Evaluation
- Admin Management
- Hiring Analytics
- Centralized Candidate Database

---

# ✨ Core Features

## 🔐 Authentication

- Secure User Registration
- JWT Authentication
- Login & Logout
- Refresh Tokens
- Protected Routes
- Password Encryption
- Secure Session Handling

---

## 📧 OTP Verification

- Email OTP Generation
- OTP Expiration
- Secure Verification
- Resend OTP
- Email Validation
- Account Activation

---

## 👤 Candidate Portal

- Personal Dashboard
- Profile Management
- Assessment History
- Performance Overview
- Verification Status
- Secure Account Management

---

## 📝 Online Assessments

### 💻 Technical Assessment

- Data Structures
- Algorithms
- Programming Concepts
- Logical Thinking
- Time Limited Test
- Automatic Submission

### 🧠 Aptitude Assessment

- Quantitative Aptitude
- Logical Reasoning
- Analytical Ability
- Verbal Reasoning
- Timed Assessment

---

## ⚡ Assessment Features

- Countdown Timer
- Question Navigation
- Progress Tracking
- Auto Save
- Auto Submission
- Instant Evaluation
- Score Calculation
- Performance Analysis

---
# 👨‍💼 Admin Dashboard

The Admin Dashboard provides a centralized interface to efficiently manage the recruitment process from candidate verification to assessment analysis.

### Admin Capabilities

- 👥 Manage Candidates
- 📧 Verify Candidate Accounts
- 📊 Monitor Assessment Statistics
- 📈 View Candidate Performance
- 🔔 Send Notifications
- 📝 Manage Assessments
- 🔐 Secure Authentication
- ⚙️ System Monitoring

---

# 📊 Analytics Dashboard

The analytics module provides valuable insights into candidate performance and recruitment progress.

### Dashboard Metrics

- 📌 Total Registered Candidates
- ✅ Verified Candidates
- ⏳ Pending Verifications
- 📝 Total Assessments Attempted
- 🎯 Average Technical Score
- 🧠 Average Aptitude Score
- 📈 Assessment Completion Rate
- 🏆 Top Performing Candidates
- 📅 Recent Activities

---

# 🔔 Notification System

The platform keeps candidates informed throughout the hiring process.

### Notifications Include

- OTP Sent Successfully
- Email Verification Status
- Assessment Availability
- Assessment Completion
- Verification Updates
- Important Announcements

---

# 🔒 Security Features

Security is a core aspect of NexVerify.

### Implemented Security Measures

- JWT Authentication
- Password Hashing
- Protected API Endpoints
- Role-Based Authorization
- Secure Email Verification
- OTP Expiration
- Input Validation
- Environment Variables
- Authentication Middleware
- Secure Session Handling

---

# 🏗️ System Architecture

```text
                    +----------------------+
                    |      Next.js         |
                    |      Frontend        |
                    +----------+-----------+
                               |
                               |
                         REST APIs
                               |
                               ▼
                 +--------------------------+
                 | Django REST Framework    |
                 |        Backend           |
                 +-----------+--------------+
                             |
          +------------------+------------------+
          |                  |                  |
          ▼                  ▼                  ▼
 Authentication       Assessments         Notifications
          |                  |                  |
          +------------------+------------------+
                             |
                             ▼
                     PostgreSQL Database
```

---

# 🔄 Application Workflow

```text
Candidate Registration
        │
        ▼
Email OTP Verification
        │
        ▼
Secure Login
        │
        ▼
Candidate Dashboard
        │
        ▼
Technical Assessment
        │
        ▼
Aptitude Assessment
        │
        ▼
Automatic Score Evaluation
        │
        ▼
Performance Analytics
        │
        ▼
Admin Dashboard Review
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Frontend Framework |
| React | UI Development |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Axios | API Communication |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Django 5 | Backend Framework |
| Django REST Framework | REST APIs |
| JWT Authentication | Authentication |
| Gunicorn | Production Server |
| WhiteNoise | Static Files |

---

## Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary Database |

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |

---

# 📂 Project Structure

```text
NexVerify
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   ├── lib
│   ├── public
│   └── styles
│
├── backend
│   ├── accounts
│   ├── authentication
│   ├── otp
│   ├── notifications
│   ├── assessment
│   ├── analysis
│   ├── config
│   ├── static
│   ├── media
│   ├── templates
│   └── manage.py
│
├── README.md
│
└── .gitignore
```

---

# ⭐ Key Highlights

| Feature | Status |
|----------|--------|
| JWT Authentication | ✅ |
| Email OTP Verification | ✅ |
| Candidate Dashboard | ✅ |
| Admin Dashboard | ✅ |
| Technical Assessment | ✅ |
| Aptitude Assessment | ✅ |
| Analytics Dashboard | ✅ |
| Responsive Design | ✅ |
| REST APIs | ✅ |
| PostgreSQL Integration | ✅ |
| Secure Authentication | ✅ |
| Production Deployment | ✅ |

---

# 💼 Why This Project Stands Out

Unlike a simple CRUD application, NexVerify demonstrates the development of a complete production-ready recruitment platform.

### Skills Demonstrated

- Full Stack Development
- REST API Development
- Authentication & Authorization
- Database Design
- Frontend & Backend Integration
- Email Services
- State Management
- Deployment
- Production Configuration
- Secure Application Development
- Responsive UI Design
- Real-world Software Architecture

---
# 🚀 Getting Started

Follow these steps to set up NexVerify locally.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/gauravmishra8595/NexVerify.git
```

Move into the project directory.

```bash
cd NexVerify
```

---

# 💻 Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=https://nexverify-api.onrender.com
```

Run the development server.

```bash
npm run dev
```

Frontend will start on

```
http://localhost:3000
```

---

# ⚙️ Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Create a virtual environment.

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run migrations.

```bash
python manage.py makemigrations

python manage.py migrate
```

Start the backend server.

```bash
python manage.py runserver
```

Backend will start on

```
http://127.0.0.1:8000
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
SECRET_KEY=your_secret_key

DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_URL=your_database_url

EMAIL_HOST=smtp.gmail.com

EMAIL_PORT=587

EMAIL_HOST_USER=your_email

EMAIL_HOST_PASSWORD=your_email_password

DEFAULT_FROM_EMAIL=your_email

JWT_SECRET_KEY=your_jwt_secret
```

---

## Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://nexverify-api.onrender.com
```

---

# 🌐 Deployment

The application is deployed using modern cloud platforms.

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |

### Live Website

**Frontend**

https://nex-verify-1bvk.vercel.app

**Backend**

https://nexverify-api.onrender.com

---

# 📸 Screenshots

Add screenshots of the application below.

### 🏠 Landing Page



---

### 🔐 Login Page

> Add Screenshot

---

### 📧 OTP Verification

> Add Screenshot

---

### 👤 Candidate Dashboard

> Add Screenshot

---

### 📝 Assessment Page

> Add Screenshot

---

### 📊 Analytics Dashboard

> Add Screenshot

---

### 👨‍💼 Admin Dashboard

> Add Screenshot

---

# 🎯 Future Enhancements

The following features are planned for future releases.

- 🤖 AI Resume Screening
- 🎥 Video Interview Support
- 👁️ Face Verification
- 📄 Resume Parsing
- 📈 Advanced Analytics
- 📥 PDF Report Export
- 🔔 Real-Time Notifications
- 🌍 Multi-Organization Support
- 📱 Mobile Responsive Enhancements
- 🌐 Google Authentication
- 💼 GitHub Authentication
- 📊 Company-wise Hiring Dashboard
- 🔍 Candidate Search & Filtering

---

# 📚 What I Learned

Building NexVerify helped me gain practical experience in:

- Designing scalable full-stack applications
- Django REST Framework
- Next.js App Router
- TypeScript
- PostgreSQL Database Design
- JWT Authentication
- Email OTP Verification
- REST API Development
- Frontend–Backend Integration
- Environment Variable Management
- Production Deployment
- Secure Authentication
- Responsive UI Design
- Real-world Software Architecture

---

# 🏆 Project Highlights

- 🚀 Production Ready Architecture
- 📱 Fully Responsive Design
- 🔐 Secure Authentication
- 📧 OTP Verification
- 📊 Admin Analytics Dashboard
- 📝 Online Assessment Platform
- 🌐 Live Deployment
- ⚡ Fast Performance
- 🛡️ Secure REST APIs
- 💼 Real-world Recruitment Use Case

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project in accordance with the license.

---

# 👨‍💻 Developer

## Gaurav Mishra

**Computer Science Engineering Student**

Passionate Full Stack Developer focused on building scalable web applications using modern technologies.

### Connect with Me

- 💻 GitHub: https://github.com/gauravmishra8595
- 🌐 Live Project: https://nex-verify-1bvk.vercel.app
- 🔗 LinkedIn: *(https://www.linkedin.com/in/gaurav-mishra-a6a707325)*


---

# ⭐ Support

If you found this project useful,

⭐ Star this repository

🍴 Fork the repository

🛠️ Contribute

📢 Share it with others

Your support helps improve the project and motivates future development.

---

# ❤️ Thank You

Thank you for visiting the NexVerify repository.

If you have any suggestions, feedback, or ideas for improvement, feel free to open an issue or submit a pull request.

Together, let's build better software.

---

<div align="center">

# ⭐ Star this Repository if you like the project!

### Built with ❤️ using Next.js, Django REST Framework & PostgreSQL

<img src="https://img.shields.io/github/stars/gauravmishra8595/NexVerify?style=social"/>

<img src="https://img.shields.io/github/forks/gauravmishra8595/NexVerify?style=social"/>

<img src="https://img.shields.io/github/watchers/gauravmishra8595/NexVerify?style=social"/>

</div>
