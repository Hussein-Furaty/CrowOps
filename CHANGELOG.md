# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Modular monolith backend architecture with domain-oriented modules.
- PostgreSQL integration with Spring Data JPA and Hibernate ORM.
- Spring Security configuration with open API access for development.
- `BaseEntity` with automatic `createdAt` and `updatedAt` audit fields.
- **User Module**: Entity, Repository, Service, Controller, and `CreateUserRequest` DTO.
- REST endpoint: `GET /api/users`.
- Project documentation: Architecture, Database Design, Database Schema, Domain Model, Server Design.
- GitHub templates: Bug Report, Feature Request, Pull Request.

---

## [0.1.0] - 2026-07-28

### Added

- Repository initialized with project structure.
- Backend directory with Spring Boot 4.1 and Maven Wrapper.
- Frontend, Docker, Scripts, and Docs directories created.
- Initial README, CONTRIBUTING, CODE_OF_CONDUCT, and SECURITY documents.
- `.gitignore` configuration.