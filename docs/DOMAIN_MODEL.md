# CrowOps Domain Model

## Purpose

This document defines the core business entities of CrowOps and their relationships. It describes **what** each entity represents in the domain before implementation details.

---

## Core Entities

### User

Represents a system administrator who accesses and operates CrowOps.

| Attribute | Description |
|-----------|-------------|
| First Name | User's first name |
| Last Name | User's last name |
| Username | Unique login identifier |
| Email | Unique email address |
| Password | Hashed authentication credential |
| Enabled | Whether the account is active |
| Locked | Whether the account is locked |

**Responsibilities:**
- Authenticate into the platform
- Manage servers and infrastructure
- Execute remote operations
- View monitoring data

**Status:** ✅ Implemented

---

### Server

Represents a remote machine managed by CrowOps. This is the **central entity** of the platform.

| Attribute | Description |
|-----------|-------------|
| Name | Display name |
| Hostname | Network hostname |
| IP Address | IPv4 or IPv6 address |
| SSH Port | Port for SSH connections |
| OS | Operating system |
| Architecture | CPU architecture |
| Description | Optional description |

**A server may be:**
- Linux or Windows machine
- Virtual machine or bare metal
- VPS or cloud instance (AWS, GCP, Azure)

**Relationships:**
- Owns one `SSH Credential`
- May have `Docker Engine` (future)
- May have `Monitoring Metrics` (future)
- May have `Scheduled Jobs` (future)

**Status:** 📋 Planned

---

### SSH Credential

Represents the authentication method used to connect to a server via SSH.

| Attribute | Description |
|-----------|-------------|
| Username | SSH login username |
| Auth Type | `PASSWORD` or `KEY` |
| Password | Encrypted password (if password auth) |
| Private Key | SSH private key (if key auth) |
| Passphrase | Key passphrase (if applicable) |

**Rules:**
- Each credential belongs to exactly one server.
- Authentication type determines which fields are required.

**Status:** 📋 Planned

---

## Future Entities

| Entity | Module | Description |
|--------|--------|-------------|
| Role | `auth` | User role for authorization |
| Permission | `auth` | Granular access permission |
| Docker Host | `docker` | Docker engine on a server |
| Container | `docker` | Running Docker container |
| Image | `docker` | Docker image |
| Metric | `monitoring` | Server performance metric |
| Alert | `monitoring` | Threshold-based alert |
| Job | `automation` | Scheduled remote task |
| Workflow | `automation` | Multi-step automation |
| Notification | `notification` | Sent notification record |
| Notification Channel | `notification` | Delivery channel configuration |

---

## Entity Relationships

```
User ──────────────── manages ──────────────── Server
                                                  │
                                                  │ owns
                                                  │
                                            SSH Credential
                                                  
Server ─── has (future) ──── Docker Host
Server ─── has (future) ──── Metrics
Server ─── has (future) ──── Jobs
Server ─── has (future) ──── Alerts
```

---

## MVP Scope

The MVP focuses on three core entities:

1. ✅ **User** — Implemented
2. 📋 **Server** — Next priority
3. 📋 **SSH Credential** — Next priority