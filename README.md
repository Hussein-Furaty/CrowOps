<h1 align="center">🐦‍⬛ CrowOps</h1>

<p align="center">
  <strong>Centralize. Monitor. Automate.</strong><br>
  Enterprise-Grade Infrastructure Management Platform
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white" alt="Maven">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Status-Under%20Development-orange?style=for-the-badge" alt="Status">
</p>

---

## 📋 Overview

CrowOps is an open-source infrastructure management platform that centralizes server administration, monitoring, and automation through a unified REST API.

Instead of managing multiple machines through separate SSH sessions and scattered tools, CrowOps provides a single platform to monitor infrastructure, execute remote operations, and manage services — designed from the ground up with **Clean Architecture**, **SOLID principles**, and **enterprise-grade scalability**.

---

## 🎯 Why CrowOps?

As infrastructure grows, managing servers becomes increasingly fragmented. Administrators switch between multiple SSH sessions, dashboards, and monitoring tools just to perform routine operations.

CrowOps solves this by providing:

- **Unified Management** — One platform for all your servers
- **Secure Access** — Centralized SSH credential management
- **Real-Time Monitoring** — CPU, memory, disk, and network metrics
- **Automation** — Scheduled jobs and remote command execution
- **Extensibility** — Modular architecture that grows with your needs

---

## 🏗️ Architecture

CrowOps follows a **Modular Monolith** architecture with domain-oriented modules and layered design.

```
com.crowops.backend
│
├── modules/                    # Domain Modules
│   ├── user/                   # User Management
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   └── dto/
│   ├── auth/                   # Authentication & Authorization
│   ├── server/                 # Server Management
│   ├── ssh/                    # SSH Connection Management
│   ├── docker/                 # Docker Container Management
│   ├── monitoring/             # Infrastructure Monitoring
│   ├── automation/             # Task Automation
│   └── notification/           # Notification System
│
└── shared/                     # Cross-Cutting Concerns
    ├── config/                 # Application Configuration
    ├── entity/                 # Base Entities
    ├── exception/              # Global Exception Handling
    └── dto/                    # Shared DTOs
```

Each module follows the **Layered Architecture** pattern:

| Layer | Responsibility |
|-------|----------------|
| **Controller** | HTTP request handling, input validation, response formatting |
| **Service** | Business logic, domain rules, orchestration |
| **Repository** | Data access, query execution |
| **Entity** | Domain model, database mapping |
| **DTO** | API contract isolation |

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Language** | Java | 21 LTS |
| **Framework** | Spring Boot | 4.1 |
| **Security** | Spring Security | 7.x |
| **Persistence** | Spring Data JPA + Hibernate | 7.x |
| **Database** | PostgreSQL | 17 |
| **Build** | Maven | 3.9+ |
| **Code Gen** | Lombok | Latest |

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **PostgreSQL 17** running on `localhost:5432`
- **Maven 3.9+** (or use the included Maven Wrapper)

### Database Setup

```sql
CREATE DATABASE crowops;
```

### Clone & Run

```bash
# Clone the repository
git clone https://github.com/Hussein-Furaty/CrowOps.git
cd CrowOps/backend

# Run with Maven Wrapper
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8081`.

### Configuration

The application configuration is located at `backend/src/main/resources/application.yaml`.

Update the database credentials as needed:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crowops
    username: postgres
    password: your_password
```

---

## 📡 API Endpoints

### User Module

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |

> More endpoints will be added as modules are developed.

---

## 🗺️ Roadmap

### Phase 1 — Foundation ✅

- [x] Spring Boot project initialization
- [x] PostgreSQL integration
- [x] Modular monolith structure
- [x] BaseEntity with audit fields
- [x] User module (Entity, Repository, Service, Controller, DTO)
- [x] Spring Security configuration
- [x] Project documentation

### Phase 2 — Authentication & Authorization

- [ ] JWT-based authentication
- [ ] User registration & login
- [ ] Role & permission management
- [ ] Password encryption with BCrypt

### Phase 3 — Infrastructure Management

- [ ] Server module (CRUD + SSH connectivity)
- [ ] SSH credential management
- [ ] Docker container management

### Phase 4 — Monitoring & Automation

- [ ] Real-time server metrics
- [ ] Alert system
- [ ] Scheduled job execution
- [ ] Notification channels (Email, Telegram, Discord)

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design principles |
| [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) | Database module organization |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Table definitions and relationships |
| [DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md) | Core business entities |
| [SERVER_DESIGN.md](docs/SERVER_DESIGN.md) | Server entity design decisions |

---

## 🤝 Contributing

Contributions are welcome! Please read the following before submitting a Pull Request:

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Developed by **[Hussein Furaty](https://github.com/Hussein-Furaty)**

---

<p align="center">
  <sub>Built with ☕ and dedication to clean architecture.</sub>
</p>