# 🚀 Blogify - A Modern Full-Stack Blogging Platform


<div align="center">

✨ **A sleek, responsive, and feature-rich blogging application built with modern web technologies** ✨

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![EJS](https://img.shields.io/badge/EJS-8A2BE2?style=for-the-badge&logo=javascript&logoColor=white)](https://ejs.co/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## 📋 Table of Contents

- 🌟 Features
- 🛠️ Tech Stack
- 🚀 Quick Start
- 📁 Project Structure
- 🎨 UI/UX Features
- 🔐 Authentication System
- 📸 Image Management
- 💾 Database Models
- 🔄 API Routes

---

## 🌟 Features

### 👥 User Management

- 🔐 **Secure Authentication** with JWT & password hashing
- 👤 **User Profiles** with customizable avatars
- 🔒 **Role-based Access** (User/Admin)
- 🚪 **Session Management** with secure logout

### ✍️ Blog Management

- 📝 **Rich Blog Creation** with cover images
- 🎨 **Beautiful Blog Display** with gradient borders
- ✏️ **Real-time Editing** capabilities
- 🗑️ **Secure Deletion** with authorization checks

### 💬 Social Features

- ❤️ **Like System** with real-time updates
- 💭 **Commenting System** with user avatars
- 👁️ **View Counts** and engagement metrics
- 🔄 **Social Sharing** capabilities

### 🎨 UI/UX Excellence

- 📱 **Fully Responsive** design
- 🎭 **Smooth Animations** and transitions
- 🌈 **Modern Gradient** designs
- 🕶️ **Dark Theme** optimized

---

## 🛠️ Tech Stack

### 🖥️ Frontend

| Technology   | Purpose                  | 
| ------------ | ------------------------- |
| `EJS`        | Templating Engine         |
| `CSS3`       | Styling & Animations      |
| `JavaScript` | Client-side Interactivity |
| `HTML5`      | Markup Structure          |

### 🔧 Backend

| Technology   | Purpose             |
| ------------ | ------------------- |
| `Node.js`    | Runtime Environment |
| `Express.js` | Web Framework       |
| `MongoDB`    | Database            |
| `Mongoose`   | ODM Library         |

### 🔐 Security & Storage

| Technology   | Purpose           |
| ------------ | ----------------  |
| `JWT`        | Authentication      |
| `bcrypt`     | Password Hashing    |
| `Cloudinary` | Image Storage       |
| `Multer`     | File Uploads        |

### 📦 Development

| Technology      | Purpose                |
| --------------- | ---------------------  |
| `Nodemon`       | Development Server       |
| `Dotenv`        | Environment Variables    |
| `Cookie-Parser` | Cookie Management        |

---

## 🚀 Quick Start

### 📥 Prerequisites

```bash
# Ensure you have Node.js installed
node --version
# v14 or higher recommended

# MongoDB installation
mongod --version

```

## ⚡ Installation

### 1. Clone the repository

```bash
git clone --no-checkout https://github.com/Rohit-Sharma3843/Main-Projects.git
cd Main-Projects
git sparse-checkout init --cone
git sparse-checkout set Blogify
cd Blogify
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Create .env file
cp .env.example .env

# Add your environment variables
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
```

### 4. Start the application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Access the application

```bash
Open http://localhost:8000 in your browser
```

## 📁 Project Structure

```bash
blogify/
├── 📁 Models/
│   ├── user.js
│   ├── blog.js
├── 📁 Controllers/
│   ├── user.js
│   ├── blog.js
│   └── comment.js
├── 📁 Routes/
│   ├── user.js
│   ├── blog.js
│   └── comment.js
├── 📁 Middlewares/
│   └── authentication.js
├── 📁 Services/
│   └── authentication.js
├── 📁 Views/
│   ├── home.ejs
│   ├── signin.ejs
│   ├── signup.ejs
│   ├── addblog.ejs
│   └── viewblog.ejs
├── 📁 Public/
│   ├── 📁 CSS/
│   │   ├── home1.css
│   │   ├── signin.css
│   │   ├── signup.css
│   │   ├── addblog.css
│   │   ├── viewblog.css
│   │   └── nav.css
│   ├── 📁 Images/
│   └── 📁 JS/
├── cloudinary.js
├── connection.js
└── index.js
```

## 🎨 UI/UX Features

### Visual Design

1. Dark Theme: Professional dark color scheme (#0f0f12 background)

2. Gradient Borders: Animated gradient borders on blog cards

3. Smooth Animations: CSS transitions and hover effects

4. Mobile-First: Fully responsive design for all devices

### User Experience

1. Fast Loading: Optimized assets and efficient database queries

2. Intuitive Navigation: Clear menu structure and call-to-action buttons

3. Readable Typography: Carefully chosen fonts and spacing for optimal reading

4. Interactive Elements: Engaging like
   buttons, comment forms, and animations

## 🔐 Authentication System

### Security Features

1. Password Hashing: SHA-256 with random salt using Node.js crypto module

2. JWT Tokens: Secure session management with httpOnly cookies

3. Middleware Protection: Route protection with authentication middleware

4. Role-based Access: User and Admin role differentiation

## 📸 Image Management

### Cloudinary Integration

1. Automatic Optimization: Image resizing and format optimization

2. Organized Storage: Folder-based organization in Cloudinary

3. CDN Delivery: Fast global content delivery

4. Secure Uploads: Multer middleware for file validation

## 🔄 API Routes

| Method | Route            | Description                | Controller |
| ------ | ---------------- | -------------------------- | ---------- |
| `GET`  | `/`              | Homepage with all blogs    | index.js   |
| `GET`  | `/user/signin`   | Render login page          | user.js    |
| `POST` | `/user/signin`   | Authenticate user          | user.js    |
| `GET`  | `/user/signup`   | Render registration page   | user.js    |
| `POST` | `/user/signup`   | Create new user            | user.js    |
| `GET`  | `/user/logout`   | Logout user                | user.js    |
| `GET`  | `/blog/addblog`  | Render blog creation form  | blog.js    |
| `POST` | `/blog/addblog`  | Create new blog with image | blog.js    |
| `GET`  | `/blog/:id `     | View specific blog         | blog.js    |
| `GET`  | `/blog/like/:id` | Like/unlike blog           | blog.js    |
| `POST` | `/comment/:id`   | Add comment to blog        | comment.js |

---
