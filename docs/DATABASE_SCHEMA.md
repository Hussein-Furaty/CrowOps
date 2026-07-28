# CrowOps Database Schema

## Overview

This document defines every database table used by CrowOps.

The schema is designed for long-term scalability.

Not every table will be implemented in the MVP.

---

# Identity Module

| Table | Description | MVP |
|--------|-------------|-----|
| users | System users | ✅ |
| roles | User roles | ❌ |
| permissions | System permissions | ❌ |
| role_permissions | Role mapping | ❌ |
| user_roles | User-role mapping | ❌ |
| audit_logs | Security audit logs | ❌ |

---

# Infrastructure Module

| Table | Description | MVP |
|--------|-------------|-----|
| servers | Registered servers | ✅ |
| server_tags | Server labels | ❌ |
| ssh_credentials | SSH authentication | ✅ |
| operating_systems | OS catalog | ❌ |

---

# Monitoring Module

| Table | Description | MVP |
|--------|-------------|-----|
| metrics | Current metrics | ❌ |
| metric_history | Historical metrics | ❌ |
| alerts | Alerts | ❌ |
| health_checks | Server health | ❌ |

---

# Docker Module

| Table | Description | MVP |
|--------|-------------|-----|
| docker_hosts | Docker endpoints | ❌ |
| containers | Docker containers | ❌ |
| images | Docker images | ❌ |
| volumes | Docker volumes | ❌ |
| networks | Docker networks | ❌ |

---

# Linux Services Module

| Table | Description | MVP |
|--------|-------------|-----|
| services | Installed services | ❌ |
| service_logs | Service history | ❌ |

---

# Database Module

| Table | Description | MVP |
|--------|-------------|-----|
| postgres_instances | PostgreSQL | ❌ |
| redis_instances | Redis | ❌ |
| rabbitmq_instances | RabbitMQ | ❌ |
| minio_instances | MinIO | ❌ |

---

# Automation Module

| Table | Description | MVP |
|--------|-------------|-----|
| jobs | Scheduled jobs | ❌ |
| scripts | Remote scripts | ❌ |
| workflows | Automation workflows | ❌ |

---

# Notification Module

| Table | Description | MVP |
|--------|-------------|-----|
| notification_channels | Notification providers | ❌ |
| notifications | Sent notifications | ❌ |

---

# Initial MVP Tables

The MVP will implement only:

- users
- servers
- ssh_credentials

All remaining tables will be added incrementally.