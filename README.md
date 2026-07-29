<h1 align="center">🐦‍⬛ CrowOps</h1>

<p align="center">
  <strong>Centralize. Monitor. Automate.</strong><br>
  Enterprise-Grade Infrastructure Management Platform with a stunning Modern UI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

---

## 📋 Overview

**CrowOps** is a powerful, open-source infrastructure management platform designed to replace scattered SSH sessions and disparate monitoring tools with a single, elegant dashboard. 

Built with **Clean Architecture** on the backend and a premium **Glassmorphism UI** on the frontend, CrowOps allows sysadmins and DevOps engineers to monitor live metrics, manage network ports, view system processes, and execute power actions seamlessly across all their Linux servers.

---

## ✨ Key Features

- ⚡ **Live Real-Time Dashboard:** Monitor CPU, Memory, Disk, Uptime, and Network I/O with 1-second auto-refresh polling.
- 🎨 **Premium UI/UX:** A stunning, fully responsive React interface utilizing custom glassmorphism design, CSS variables, and modern animations.
- 🔐 **Secure Credential Management:** Encapsulated SSH credential handling per server (supports both Password and PEM Private Keys).
- 📊 **Network & Process Analysis:** Instantly view active TCP/UDP listening sockets and the top 20 CPU-consuming processes without typing a single Linux command.
- 🔌 **Power Actions:** Safely reboot, shutdown, or restart common services (Nginx, Docker, PostgreSQL, etc.) directly from the GUI.
- 🛡️ **Enterprise Security:** JWT stateless authentication, BCrypt password hashing, and structured JSON API error handling.
- 🐳 **Docker-Ready Deployment:** Comes out-of-the-box with a multi-stage Docker setup (Nginx + Spring Boot + Postgres).

---

## 🚀 Quick Start

Deploying CrowOps is incredibly simple. We offer a pre-built production setup that does not require downloading any source code.

### Prerequisites
- Docker & Docker Compose installed on your machine.

### Option 1: Production Deployment (Recommended)
Download the production compose file and run it:
```bash
# Download the docker-compose file
curl -O https://raw.githubusercontent.com/Hussein-Furaty/CrowOps/main/docker-compose.prod.yml

# Start the platform
docker-compose -f docker-compose.prod.yml up -d
```
This will automatically pull the latest pre-built images from our GitHub Container Registry.

### Option 2: Local Development Setup
If you want to modify the code, clone the repository and build from source:
```bash
git clone https://github.com/Hussein-Furaty/CrowOps.git
cd CrowOps
docker-compose up --build -d
```

### Accessing the Platform
- **Frontend UI:** `http://localhost`
- **Backend API:** `http://localhost:8081`

> **Note:** On your first login, you will need to register an admin user via the API or use a pre-seeded account (if configured).

---

## 🏗️ Architecture

CrowOps is divided into two main components:

1. **Frontend (React + Vite + TypeScript):** Served via an Nginx alpine container. It uses Axios for API communication and Lucide React for iconography.
2. **Backend (Spring Boot + Java 21):** A modular monolith utilizing Spring Data JPA, Spring Security, and the JSch library for executing pure, agent-less remote SSH commands on target Linux servers.
3. **Database (PostgreSQL):** Stores users, server configurations, and encrypted SSH metadata.

For deep technical details, check out our [Documentation section](#-documentation).

---

## 📚 Documentation

Dive deeper into the design decisions and system architecture:

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design principles |
| [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) | Database module organization |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Table definitions and relationships |
| [DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md) | Core business entities |
| [SERVER_DESIGN.md](docs/SERVER_DESIGN.md) | Server entity design decisions |

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue for bug reports or feature requests, or submit a Pull Request.
Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Developed by <b><a href="https://github.com/Hussein-Furaty">Hussein Furaty</a></b>
</p>