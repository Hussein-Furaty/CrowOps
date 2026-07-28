# CrowOps Architecture

## Purpose

This document describes the high-level architecture of CrowOps.

The goal is to define the overall system structure before implementing features.

CrowOps follows a layered architecture with clear separation of responsibilities.

---

# High-Level Architecture

```
                +----------------------+
                |      Frontend        |
                |   (React - Future)   |
                +----------+-----------+
                           |
                           | REST API
                           |
                +----------v-----------+
                |   Spring Boot API    |
                +----------+-----------+
                           |
        +------------------+------------------+
        |                  |                  |
        |                  |                  |
+-------v------+   +--------v-------+  +-------v-------+
|   Services   |   |   Security     |  | Configuration |
+-------+------+   +--------+-------+  +-------+-------+
        |                   |                  |
        +-------------------+------------------+
                            |
                    +-------v-------+
                    | Repositories  |
                    +-------+-------+
                            |
                    +-------v-------+
                    | PostgreSQL DB |
                    +---------------+
```

---

# Architecture Style

CrowOps uses:

- Layered Architecture
- RESTful API
- Domain-Oriented Design
- Dependency Injection
- SOLID Principles

The project starts simple but is designed to scale over time.

---

# Layers

## Controller Layer

Responsibilities:

- Receive HTTP requests
- Validate input
- Return HTTP responses

Controllers should not contain business logic.

---

## Service Layer

Responsibilities:

- Business logic
- Validation
- Coordination between repositories
- Domain rules

All application logic belongs here.

---

## Repository Layer

Responsibilities:

- Database communication
- CRUD operations
- Query execution

Repositories should not contain business logic.

---

## Entity Layer

Represents database tables.

Entities should model the domain and remain persistence-focused.

---

## DTO Layer

DTOs isolate API contracts from database models.

Entities should never be exposed directly through the REST API.

---

## Security Layer

Responsible for:

- Authentication
- Authorization
- JWT
- User roles
- Permissions

---

## Configuration Layer

Contains application configuration such as:

- Security configuration
- Swagger configuration
- Database configuration

---

# Database

CrowOps uses PostgreSQL.

Hibernate is responsible for ORM.

Spring Data JPA provides repository abstraction.

---

# Future Modules

The architecture should support future modules without major refactoring.

Planned modules include:

- Server Management
- Docker Management
- Linux Services
- Databases
- Monitoring
- Alerts
- Notifications
- Automation
- Audit Logs

---

# Design Principles

The project follows these principles:

- Single Responsibility Principle
- Open/Closed Principle
- Dependency Inversion
- Separation of Concerns
- Clean Code
- Maintainability
- Scalability

Every new feature should follow the same architecture.