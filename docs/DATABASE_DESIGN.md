# CrowOps Database Design

## Design Philosophy

CrowOps uses a **modular database design** where each domain module owns its tables. The database is organized into logical groups that mirror the application's module structure.

The schema is designed for long-term scalability — only MVP tables are implemented initially, while the full schema is documented to guide future development.

---

## Database Technology

| Component | Technology |
|-----------|-----------|
| **RDBMS** | PostgreSQL 17 |
| **ORM** | Hibernate 7 (via Spring Data JPA) |
| **Schema Management** | Hibernate `ddl-auto: update` (development) |
| **Naming Strategy** | `snake_case` for all database objects |

---

## Module Ownership

Each module owns and manages its own tables. Cross-module relationships use foreign keys where necessary.

### Identity & Access Management

Responsible for user accounts, roles, and permissions.

| Table | Owner Module |
|-------|-------------|
| `users` | `user` |
| `roles` | `auth` |
| `permissions` | `auth` |
| `role_permissions` | `auth` |
| `user_roles` | `auth` |
| `audit_logs` | `auth` |

### Infrastructure

Responsible for server registration and SSH access.

| Table | Owner Module |
|-------|-------------|
| `servers` | `server` |
| `server_tags` | `server` |
| `ssh_credentials` | `ssh` |

### Monitoring

Responsible for metrics, health checks, and alerting.

| Table | Owner Module |
|-------|-------------|
| `metrics` | `monitoring` |
| `metric_history` | `monitoring` |
| `alerts` | `monitoring` |
| `health_checks` | `monitoring` |

### Docker

Responsible for Docker host and container management.

| Table | Owner Module |
|-------|-------------|
| `docker_hosts` | `docker` |
| `containers` | `docker` |
| `images` | `docker` |
| `volumes` | `docker` |
| `networks` | `docker` |

### Automation

Responsible for job scheduling and workflow execution.

| Table | Owner Module |
|-------|-------------|
| `jobs` | `automation` |
| `scripts` | `automation` |
| `workflows` | `automation` |

### Notifications

Responsible for multi-channel notification delivery.

| Table | Owner Module |
|-------|-------------|
| `notification_channels` | `notification` |
| `notifications` | `notification` |

---

## Common Columns

All entities extend `BaseEntity`, which provides:

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | `BIGINT` | `PRIMARY KEY, AUTO_INCREMENT` | Unique identifier |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last modification timestamp |

---

## Naming Conventions

| Object | Convention | Example |
|--------|-----------|---------|
| Tables | `snake_case`, plural | `users`, `ssh_credentials` |
| Columns | `snake_case` | `first_name`, `created_at` |
| Foreign Keys | `<table>_id` | `user_id`, `server_id` |
| Indexes | `idx_<table>_<column>` | `idx_users_email` |
| Unique Constraints | `uk_<table>_<column>` | `uk_users_username` |

---

## MVP Scope

The initial release implements only:

- ✅ `users` — System user accounts

The following are planned for subsequent phases:

- `servers` — Registered servers
- `ssh_credentials` — SSH authentication data
- Remaining tables as modules are developed

All remaining tables will be added incrementally following the same design principles.