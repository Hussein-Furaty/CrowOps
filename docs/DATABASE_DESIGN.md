# CrowOps Database Design

## Design Philosophy

CrowOps is designed as a modular enterprise platform.

The database is organized into logical modules.

The first release (MVP) will implement only a subset of these modules, while the schema is designed to support future expansion without major redesign.

---

# Core Modules

## Identity & Access Management

Responsible for:

- Users
- Roles
- Permissions
- Authentication
- Audit Logs

---

## Infrastructure

Responsible for:

- Servers
- SSH Credentials
- Operating Systems
- Server Tags

---

## Monitoring

Responsible for:

- Metrics
- Health Checks
- Historical Data
- Alerts

---

## Docker

Responsible for:

- Containers
- Images
- Volumes
- Networks

---

## Linux Services

Responsible for:

- Installed Services
- Service Status
- Service Actions

---

## Databases

Responsible for:

- PostgreSQL
- Redis
- RabbitMQ
- MinIO

---

## Automation

Responsible for:

- Scheduled Jobs
- Remote Scripts
- Workflows

---

## Notifications

Responsible for:

- Email
- Telegram
- Discord
- Slack

---

# MVP Scope

The first version implements only:

- Users
- Servers
- SSH Connection Testing
- Basic Server Information

All remaining modules are planned for future releases.