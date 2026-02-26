# 🚀 Civic Issue Resolution System

A modern, community-driven platform to **report, track, and resolve civic issues** with transparency and accountability.

🌐 **Live Demo:** [ResolIssue](https://resolissue.vercel.app)

---

## 📌 1. Project Overview

- 📝 Citizens can report civic issues with title, description, images, and precise location  
- 👍 Community members can like and comment to indicate priority  
- 🔄 Issues move through clear states: pending, in-progress, resolved  
- 🛡️ Admin users moderate content and update issue status  
- 📊 Dashboards help users track their contribution and impact  

---

## 🧱 2. System Architecture

- 🧩 Component-based design for maintainability  
- 🔐 Role-based access for users and admins  
- 📡 Centralized data storage with real-time reads  
- 🗂️ Clean separation between UI, auth, and data layers  

---

## 🛠️ 3. Tech Stack

- ⚛️ Next.js (App Router)  
- 🎨 Tailwind CSS  
- 🗄️ Supabase (database + storage)  
- 🔐 Kinde Authentication  
- ☁️ Cloudinary (image handling)  
- 🧠 Lucide Icons  

---

## 📂 4. Key Components

- 🧭 **Navbar** – navigation and session handling  
- 📝 **IssueForm** – create a new issue  
- 📄 **Issue** – issue card and summary view  
- 👍 **Like** – upvote functionality  
- 💬 **PostComment** – add comments  
- 👀 **ShowComment** – render discussion threads  
- 🔄 **UpdateStatus** – admin-only status control  
- 🔐 **Signup** – user onboarding  

---

## 👥 5. User Roles

- 👤 **Normal User**  
  - Report issues  
  - Like and comment  
  - Track personal reports  

- 🛡️ **Admin**  
  - Remove fake or invalid issues  
  - Update issue status  
  - Maintain platform discipline  

---

## 🔐 6. Authentication & Security

- Secure login and session handling with Kinde  
- Permission checks before sensitive actions  
- Controlled admin operations  

---

## ☁️ 7. Deployment Readiness

- Cloud-friendly architecture  
- Scalable backend services (Supabase)  
- Stateless frontend design  

---

## ⬇️ 8. Download & Run Locally

```bash
git clone https://github.com/Rohit-Sharma3843/Main-Projects/tree/main/ResolIssue.git
cd ResolIssue
npm install
npm run dev
