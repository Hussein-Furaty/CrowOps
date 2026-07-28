# Server Design

## Purpose

The Server entity is the core of CrowOps.

Every managed resource in the platform is associated with a server.

Examples:

- Linux Server
- Windows Server
- Virtual Machine
- VPS
- Cloud Instance

---

# Responsibilities

A Server represents a remote machine that CrowOps can connect to, monitor, and manage.

The server itself does not store monitoring data.

Instead, monitoring data belongs to dedicated monitoring modules.

---

# Core Attributes

## Identity

- Name
- Hostname
- Description

---

## Network

- IP Address
- SSH Port

---

## Operating System

- Operating System
- Architecture

---

## Authentication

Each server owns one SSH Credential.

Authentication can use:

- Password
- SSH Private Key

---

## Status

The platform should be able to determine:

- Online
- Offline
- Last Seen

These values are runtime information and should not all be permanently stored.

---

## Monitoring

The Server does not permanently store:

- CPU Usage
- Memory Usage
- Disk Usage
- Network Usage

Those belong to the Monitoring module.

---

## Future Relationships

A Server may contain:

- Docker Engine
- Linux Services
- Databases
- Scheduled Jobs
- Monitoring Metrics
- Alerts

---

# Design Rules

A server must have:

- Unique IP Address
- SSH Port
- Hostname

The server should remain lightweight.

Operational data belongs to other modules.

---

# MVP

The first implementation supports:

- Add Server
- Update Server
- Delete Server
- List Servers
- Test SSH Connection
- Retrieve Basic Information