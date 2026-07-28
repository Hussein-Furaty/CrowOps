# CrowOps Database Schema

## Overview

This document defines the database tables for CrowOps, organized by module. Each table includes column definitions with types, constraints, and descriptions.

Tables marked with ✅ are implemented. Tables marked with 📋 are planned for future phases.

---

## Identity & Access Management

### `users` ✅

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `first_name` | `VARCHAR(100)` | `NOT NULL` | User's first name |
| `last_name` | `VARCHAR(100)` | `NOT NULL` | User's last name |
| `username` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Login username |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | Hashed password |
| `enabled` | `BOOLEAN` | `NOT NULL, DEFAULT true` | Account active flag |
| `locked` | `BOOLEAN` | `NOT NULL, DEFAULT false` | Account locked flag |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

### `roles` 📋

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `name` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Role name |
| `description` | `VARCHAR(255)` | | Role description |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

### `permissions` 📋

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `name` | `VARCHAR(100)` | `NOT NULL, UNIQUE` | Permission identifier |
| `description` | `VARCHAR(255)` | | Permission description |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

### `role_permissions` 📋

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `role_id` | `BIGINT` | `FK → roles.id` | Role reference |
| `permission_id` | `BIGINT` | `FK → permissions.id` | Permission reference |

### `user_roles` 📋

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `BIGINT` | `FK → users.id` | User reference |
| `role_id` | `BIGINT` | `FK → roles.id` | Role reference |

---

## Infrastructure

### `servers` 📋

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Display name |
| `hostname` | `VARCHAR(255)` | `NOT NULL` | Server hostname |
| `ip_address` | `VARCHAR(45)` | `NOT NULL, UNIQUE` | IPv4 or IPv6 address |
| `ssh_port` | `INTEGER` | `NOT NULL, DEFAULT 22` | SSH port number |
| `os` | `VARCHAR(100)` | | Operating system |
| `architecture` | `VARCHAR(50)` | | CPU architecture |
| `description` | `TEXT` | | Server description |
| `enabled` | `BOOLEAN` | `NOT NULL, DEFAULT true` | Server active flag |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

### `ssh_credentials` 📋

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `server_id` | `BIGINT` | `FK → servers.id, UNIQUE` | Owning server |
| `username` | `VARCHAR(100)` | `NOT NULL` | SSH username |
| `auth_type` | `VARCHAR(20)` | `NOT NULL` | `PASSWORD` or `KEY` |
| `password` | `VARCHAR(255)` | | Encrypted password |
| `private_key` | `TEXT` | | SSH private key |
| `passphrase` | `VARCHAR(255)` | | Key passphrase |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

---

## Monitoring 📋

### `metrics`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `server_id` | `BIGINT` | `FK → servers.id` | Target server |
| `cpu_usage` | `DOUBLE` | | CPU usage percentage |
| `memory_usage` | `DOUBLE` | | Memory usage percentage |
| `disk_usage` | `DOUBLE` | | Disk usage percentage |
| `collected_at` | `TIMESTAMP` | `NOT NULL` | Collection timestamp |

### `alerts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `server_id` | `BIGINT` | `FK → servers.id` | Target server |
| `type` | `VARCHAR(50)` | `NOT NULL` | Alert type |
| `message` | `TEXT` | `NOT NULL` | Alert message |
| `severity` | `VARCHAR(20)` | `NOT NULL` | `INFO`, `WARNING`, `CRITICAL` |
| `resolved` | `BOOLEAN` | `NOT NULL, DEFAULT false` | Resolution status |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |

---

## Docker 📋

### `docker_hosts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `server_id` | `BIGINT` | `FK → servers.id, UNIQUE` | Host server |
| `api_url` | `VARCHAR(255)` | `NOT NULL` | Docker API endpoint |
| `tls_enabled` | `BOOLEAN` | `NOT NULL, DEFAULT false` | TLS configuration |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

---

## Automation 📋

### `jobs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Job name |
| `cron_expression` | `VARCHAR(100)` | | Cron schedule |
| `command` | `TEXT` | `NOT NULL` | Command to execute |
| `server_id` | `BIGINT` | `FK → servers.id` | Target server |
| `enabled` | `BOOLEAN` | `NOT NULL, DEFAULT true` | Job active flag |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |

---

## Notifications 📋

### `notification_channels`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK, AUTO_INCREMENT` | Unique identifier |
| `type` | `VARCHAR(50)` | `NOT NULL` | `EMAIL`, `TELEGRAM`, `DISCORD`, `SLACK` |
| `config` | `JSONB` | `NOT NULL` | Channel configuration |
| `enabled` | `BOOLEAN` | `NOT NULL, DEFAULT true` | Channel active flag |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp |