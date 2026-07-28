# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.1.0] - 2026-07-28

### Added

- **Architecture & Security**:
  - Stateless Spring Security configuration using JWT (`JJWT` 0.11.5).
  - BCrypt password encoder for safe user password storage.
  - Standardized REST exception handling via `GlobalExceptionHandler` and `ApiErrorResponse`.
- **User Module**:
  - Full CRUD operations and User registration (`POST /api/users`, `GET /api/users`).
  - DTO isolation with `UserResponse` and `CreateUserRequest` containing strict validation rules.
  - Dedicated unit tests for `UserService`.
- **Server Module**:
  - Full CRUD endpoints (`/api/servers`) with IP address uniqueness validation.
  - DTO isolation using `ServerResponse`, `CreateServerRequest`, and `UpdateServerRequest`.
  - Real-time SSH system metrics extraction (`GET /api/servers/{id}/system-info`) returning CPU, RAM, Disk, Uptime, and OS info.
  - Dedicated unit tests for `ServerService`.
- **SSH Credential Module**:
  - One-to-One SSH credentials mapping to Servers (`/api/servers/{id}/ssh-credentials`).
  - Support for `PASSWORD` and `KEY` authentication types.
  - `SshCredentialResponse` DTO that conceals secrets and exposes boolean existence flags.
  - Real-time SSH connection tester service powered by `JSch` (`com.github.mwiede:jsch`).
- **DevOps & Containerization**:
  - Multi-stage `Dockerfile` using Eclipse Temurin JDK/JRE 21 Alpine images.
  - `docker-compose.yml` orchestrating Spring Boot backend and PostgreSQL 16 Alpine with healthchecks.