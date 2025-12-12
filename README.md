# esumbong_2025 (Frontend)
Mga doo mau ni instructions..
Naa pangutana chat lang sa GC i mention rako ninyo
A Next.js 14 + TypeScript project for the eSumbong platform.

This document will guide you through installation, environment setup, Git workflow, and running the frontend locally.

---

## 📦 Requirements

Before running the project, install the following:

- **Node.js LTS** (Recommended: 20.x)  
  Download here: https://nodejs.org/en/download/prebuilt-installer

- **Git**  
  https://git-scm.com/downloads

---

## 🔥 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mmanrus/esumbong_2025.git
cd esumbong_2025
```
## 🔐 Environment Variables

Before running the project, you must create a `.env` file in the project root.

### Create `.env` file
In the root folder of the frontend, create a file named: Or add file in the esumbong_2025
```
SESSION_SECRET=your_jwt_secret_here
BACKEND_URL=http://localhost:3005
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Install Dependencies
```bash
npm install
```

## Running the Development Server
```bash
npm run dev
```

## Open your browser to:
    http://localhost:3000
# 🧑‍💻 Git Workflow (Very Important for Developers)

## Follow this process every time you make changes.
1. Make sure you're on the latest main branch
git checkout main
git pull origin main

## 2. Create a new feature branch
git checkout -b feature/my-feature


## Example:
git checkout -b feature/login-page

## 3. Make changes → Stage → Commit
git add .
git commit -m "Added login UI"

## 4. Rebase with latest main (keep your history clean)
git pull --rebase origin main

## 5. Push your branch
git push -u origin feature/login-page

## 6. Create a Pull Request (PR)

## Go to GitHub:

Open your repo
Click Pull Requests → New Pull Request
Choose:
base: main
compare: your feature branch

## Submit PR
