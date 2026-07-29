# CrowOps Frontend Dashboard

The official web frontend for the **CrowOps** infrastructure management platform. Built with a modern tech stack to deliver a fast, responsive, and beautiful user experience.

## 🚀 Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS with custom Glassmorphism Design System
- **Icons**: Lucide React
- **HTTP Client**: Axios

## ✨ Features
- **Live Server Metrics**: Real-time polling (1s intervals) of CPU, RAM, Disk, Uptime, and Network statistics.
- **Process Monitoring**: View top CPU-consuming processes fetched directly via SSH.
- **Network Analysis**: Inspect active listening TCP/UDP ports.
- **Power Actions**: Perform server reboots, shutdowns, and restart common services.
- **Premium UI**: Custom-built CSS variables system with dark mode, animations, and glass effects.

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js 20+ installed.

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`. It expects the Spring Boot backend to be running on `http://localhost:8081`.

### Production Build
```bash
npm run build
```
This generates a production-ready bundle in the `dist` folder.

## 🐳 Docker Deployment
A multi-stage `Dockerfile` is provided that builds the Vite app and serves it using Nginx on port 80.
It is recommended to deploy using the `docker-compose.yml` located in the root of the project.
