<h1 align="center">🐦‍⬛ CrowOps</h1>

<p align="center">
  <strong>Centralize. Monitor. Automate.</strong><br>
  Enterprise-Grade Infrastructure Management Platform
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Status-v0.2.0%20(Live%20Dashboard)-green?style=for-the-badge" alt="Status">
</p>

---

## 📋 Overview

CrowOps is an open-source enterprise infrastructure management platform that centralizes server administration, monitoring, and automation through a unified REST API.

Instead of managing multiple machines through separate SSH sessions and scattered tools, CrowOps provides a single platform to monitor infrastructure, execute remote operations, and manage services — designed from the ground up with **Clean Architecture**, **SOLID principles**, and **enterprise-grade scalability**.

---

## 🎯 Features (v0.1.0 MVP)

- **Authentication & Security**: JWT stateless authentication with BCrypt password hashing.
- **Modern Live Dashboard**: A premium, React-based (Vite/TypeScript) glassmorphism dashboard.
- **Server Administration**: Complete CRUD API for managing server instances.
- **SSH Credential Management**: Encapsulated One-to-One credential linking per server supporting PASSWORD and KEY auth types.
- **Live Diagnostics (1s Polling)**: Real-time system metrics (CPU, RAM, Disk, Uptime, Load Average, Network I/O).
- **Process & Network Monitoring**: View active TCP/UDP ports and top CPU-consuming processes.
- **Power Actions**: Reboot, Shutdown, or restart popular services directly from the dashboard.
- **Container Readiness**: Multi-stage `Dockerfile` and `docker-compose.yml` for full-stack deployment (Nginx/React + Spring Boot + Postgres).

---

## 🚀 Getting Started

### Option 1: Run with Docker Compose (Recommended)

Ensure Docker Desktop is installed and running, then execute:

```bash
docker-compose up --build -d
```

The frontend application will be available at `http://localhost`, and the API at `http://localhost:8081`.

### Option 2: Local Development Setup

#### Prerequisites
- **Java 21** or higher
- **PostgreSQL 17** running on `localhost:5432` with database `crowops` created

```bash
# Clone repository
git clone https://github.com/Hussein-Furaty/CrowOps.git
cd CrowOps/backend

# Run with Maven Wrapper
./mvnw spring-boot:run
```

---

## 📡 API Endpoints

### Auth Module
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | Authenticate user and receive JWT Token | No |
| `POST` | `/api/users` | Register a new user | No |

### User Module
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users` | List all users | Yes |

### Server Module
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/servers` | List all registered servers | Yes |
| `POST` | `/api/servers` | Register a new server | Yes |
| `GET` | `/api/servers/{id}` | Get server details by ID | Yes |
| `PUT` | `/api/servers/{id}` | Update server information | Yes |
| `DELETE` | `/api/servers/{id}` | Delete a server | Yes |
| `GET` | `/api/servers/{id}/system-info` | Fetch live SSH system metrics (RAM, CPU, Disk) | Yes |

### SSH Module
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/servers/{serverId}/ssh-credentials` | Get credential status for server | Yes |
| `PUT` | `/api/servers/{serverId}/ssh-credentials` | Create or update SSH credentials | Yes |
| `DELETE` | `/api/servers/{serverId}/ssh-credentials` | Delete SSH credentials | Yes |
| `POST` | `/api/servers/{serverId}/ssh-credentials/test` | Test SSH connectivity | Yes |

---

## 🗺️ Roadmap

### Phase 1 — Foundation & MVP ✅
- [x] Spring Boot modular monolith architecture
- [x] PostgreSQL integration & BaseEntity audit tracking
- [x] User management module
- [x] JWT Authentication & BCrypt Password Encryption
- [x] Server management CRUD module
- [x] SSH Credential management module
- [x] Real-time SSH Connection tester & System Info extractor
- [x] Dockerfile & Docker Compose configuration
- [x] Automated Unit Test Suite (JUnit 5 + Mockito)

### Phase 2 — Docker Management & Monitoring (Coming Next)
- [ ] Remote Docker container management over SSH
- [ ] Automated health checks & alerts
- [ ] Task automation & scheduled executions

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design principles |
| [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) | Database module organization |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Table definitions and relationships |
| [DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md) | Core business entities |
| [SERVER_DESIGN.md](docs/SERVER_DESIGN.md) | Server entity design decisions |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Developed by **[Hussein Furaty](https://github.com/Hussein-Furaty)**