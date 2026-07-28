# Server Design

## Purpose

The Server entity is the **central domain object** of CrowOps. Every managed resource in the platform is associated with a server. This document defines the design decisions and rules governing the Server entity.

---

## What is a Server?

A Server represents a remote machine that CrowOps can connect to, monitor, and manage.

**Supported types:**

| Type | Example |
|------|---------|
| Linux Server | Ubuntu, CentOS, Debian |
| Windows Server | Windows Server 2022 |
| Virtual Machine | VMware, Hyper-V, KVM |
| VPS | DigitalOcean, Linode, Hetzner |
| Cloud Instance | AWS EC2, GCP Compute, Azure VM |

---

## Core Attributes

### Identity

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| Name | `VARCHAR(100)` | ✅ | Human-readable display name |
| Hostname | `VARCHAR(255)` | ✅ | Network hostname |
| Description | `TEXT` | ❌ | Optional description |

### Network

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| IP Address | `VARCHAR(45)` | ✅ | IPv4 or IPv6 address (unique) |
| SSH Port | `INTEGER` | ✅ | SSH port (default: 22) |

### System Information

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| Operating System | `VARCHAR(100)` | ❌ | OS name and version |
| Architecture | `VARCHAR(50)` | ❌ | CPU architecture (x86_64, ARM) |

---

## Authentication

Each server owns **exactly one** SSH Credential.

| Auth Type | Fields Used |
|-----------|-------------|
| Password | `username` + `password` |
| SSH Key | `username` + `private_key` + optional `passphrase` |

The credential is managed by the `ssh` module, not the `server` module. The server holds only a foreign key reference.

---

## Runtime vs. Persistent Data

| Data | Storage | Owner |
|------|---------|-------|
| Name, IP, Hostname | Database | `server` module |
| SSH Credentials | Database | `ssh` module |
| Online/Offline status | Runtime only | `monitoring` module |
| Last Seen timestamp | Runtime/Cache | `monitoring` module |
| CPU, Memory, Disk usage | Separate table | `monitoring` module |

**Design Rule:** The server entity remains lightweight. Operational and monitoring data belongs to dedicated modules.

---

## Future Relationships

A Server may be associated with:

| Relationship | Module |
|-------------|--------|
| Docker Engine | `docker` |
| Linux Services | Future module |
| Database Instances | Future module |
| Scheduled Jobs | `automation` |
| Monitoring Metrics | `monitoring` |
| Alerts | `monitoring` |

---

## Validation Rules

| Rule | Description |
|------|-------------|
| Unique IP | No two servers may share the same IP address |
| Required Hostname | Every server must have a hostname |
| Valid SSH Port | Port must be between 1 and 65535 |
| Required Name | Every server must have a display name |

---

## MVP Operations

The first implementation will support:

| Operation | HTTP Method | Endpoint |
|-----------|-------------|----------|
| Add Server | `POST` | `/api/servers` |
| List Servers | `GET` | `/api/servers` |
| Get Server | `GET` | `/api/servers/{id}` |
| Update Server | `PUT` | `/api/servers/{id}` |
| Delete Server | `DELETE` | `/api/servers/{id}` |
| Test SSH Connection | `POST` | `/api/servers/{id}/test-connection` |