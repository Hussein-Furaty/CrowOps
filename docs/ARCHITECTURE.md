# CrowOps Architecture

## Purpose

This document defines the high-level architecture of CrowOps and serves as the single source of truth for all architectural decisions.

---

## Architecture Style

CrowOps is built as a **Modular Monolith** — a single deployable unit with well-defined internal module boundaries.

| Principle | Description |
|-----------|-------------|
| **Modular Monolith** | Domain modules with clear boundaries inside a single deployment |
| **Layered Architecture** | Controller → Service → Repository → Entity |
| **Domain-Oriented Design** | Each module owns its domain logic, entities, and data access |
| **Dependency Injection** | Spring-managed beans with constructor injection |
| **SOLID Principles** | Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion |
| **Clean Architecture** | Business logic is independent of frameworks and infrastructure |

---

## High-Level Overview

```
                  ┌──────────────────────┐
                  │      Frontend        │
                  │   (React - Future)   │
                  └──────────┬───────────┘
                             │
                          REST API
                             │
                  ┌──────────▼───────────┐
                  │    Spring Boot API   │
                  │   (Modular Monolith) │
                  └──────────┬───────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
   │   Modules   │   │   Security  │   │   Shared    │
   │  (Domain)   │   │   (Auth)    │   │  (Common)   │
   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Repositories  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  PostgreSQL DB  │
                    └─────────────────┘
```

---

## Layer Responsibilities

### Controller Layer

- Receives HTTP requests and returns HTTP responses.
- Validates input using Jakarta Validation annotations.
- Maps between DTOs and service calls.
- **Must not** contain business logic.

### Service Layer

- Contains all business logic and domain rules.
- Coordinates between repositories.
- Performs validation beyond simple input checks.
- Manages transactions.

### Repository Layer

- Handles database communication through Spring Data JPA.
- Provides CRUD operations and custom queries.
- **Must not** contain business logic.

### Entity Layer

- Represents database tables using JPA annotations.
- Models the domain and remains persistence-focused.
- All entities extend `BaseEntity` for common audit fields.

### DTO Layer

- Isolates API contracts from database models.
- **Entities must never be exposed directly through the REST API.**
- Separate DTOs for requests and responses.

---

## Module Structure

Each domain module follows a consistent internal structure:

```
modules/<module-name>/
├── controller/       # REST endpoints
├── service/          # Business logic
├── repository/       # Data access
├── entity/           # JPA entities
└── dto/              # Request/Response DTOs
```

### Current Modules

| Module | Status | Description |
|--------|--------|-------------|
| `user` | ✅ Active | User management |
| `auth` | 📋 Planned | Authentication & authorization |
| `server` | 📋 Planned | Server registration & management |
| `ssh` | 📋 Planned | SSH credential & connection management |
| `docker` | 📋 Planned | Docker container management |
| `monitoring` | 📋 Planned | Infrastructure metrics & alerts |
| `automation` | 📋 Planned | Scheduled jobs & workflows |
| `notification` | 📋 Planned | Multi-channel notifications |

---

## Shared Components

Cross-cutting concerns live in the `shared/` package:

```
shared/
├── config/           # Application configuration (Security, etc.)
├── entity/           # BaseEntity and common mapped superclasses
├── exception/        # Global exception handling (planned)
└── dto/              # Shared DTOs (planned)
```

**Rules:**
- Only truly cross-cutting code belongs in `shared/`.
- Module-specific code must stay within its module.
- Modules should not depend on each other directly.

---

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | Each class has one reason to change |
| **Open/Closed** | Extend behavior without modifying existing code |
| **Dependency Inversion** | Depend on abstractions, not concretions |
| **Separation of Concerns** | Each layer has a distinct responsibility |
| **Don't Repeat Yourself** | Shared logic lives in `shared/` |
| **Convention over Configuration** | Consistent naming and structure across modules |

---

## Future Considerations

The architecture is designed to support:

- Extracting modules into independent microservices if needed.
- Event-driven communication between modules.
- Horizontal scaling behind a load balancer.
- API versioning for backward compatibility.

Every new feature must follow the established architecture. Deviations require an Architecture Decision Record (ADR) in `docs/decisions/`.